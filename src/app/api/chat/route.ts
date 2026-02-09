import { NextRequest, NextResponse } from "next/server";
import { open, getEmbedder } from "@memvid/sdk";
import path from "path";
import fs from "fs";

// On Vercel/serverless the filesystem is read-only; Memvid needs to write (indexes/locks).
// Copy the memory file to /tmp once per instance so open() succeeds.
const TMP_MEMORY_PATH = path.join("/tmp", "tafsiir.mv2");
let tmpMemoryReady = false;

function getMemoryPath(): string {
  const source = path.join(process.cwd(), "data", "tafsiir.mv2");
  if (!fs.existsSync(source)) return source;
  if (!tmpMemoryReady) {
    try {
      fs.copyFileSync(source, TMP_MEMORY_PATH);
      tmpMemoryReady = true;
    } catch (e) {
      console.warn("LOG: Copy to /tmp failed, using source path", e);
      return source;
    }
  }
  return TMP_MEMORY_PATH;
}

// Refusal template (Somali)
const REFUSAL_MSG =
  "Ma helin tafsiir cad oo ku saabsan su’aashan. Sidaas darteed kama jawaabi karo anigoo aan hubin.";

/** Clean AI output: remove "Carabi" label, use "Tafsiir" instead of "Soomaali" */
function cleanTafsirResponse(text: string): string {
  return text
    .replace(/:?\s*Carabi\s*:?/gi, "")
    .replace(/\*\*Soomaali\*\s*:?/gi, "**Tafsiir:**")
    .replace(/Soomaali\s*:?\s*/gi, "Tafsiir: ")
    .replace(/\s{2,}/g, "\n\n")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    console.log("LOG: message:", message);

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("PLACEHOLDER")) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // 1. Setup Memvid & Embedder (memory must be built with Gemini: bun run ingest)
    console.log("LOG: Initializing retrieval...");
    const sourceFile = path.join(process.cwd(), "data", "tafsiir.mv2");

    if (!fs.existsSync(sourceFile)) {
      console.warn(
        "LOG: Memory file not found, creating empty fallback context",
      );
      return NextResponse.json({
        text: "Nidaamku wali ma diyaarsana (Memory file missing). Fadlan maamulaha la xiriir.",
      });
    }

    const memoryPath = getMemoryPath();

    const embedder = getEmbedder("gemini", {
      apiKey,
      model: "gemini-embedding-001",
    });
    const memvidKey = process.env.MEMVID_API_KEY?.trim();
    const mv = await open(
      memoryPath,
      "basic",
      memvidKey?.startsWith("mv2_") ? { memvidApiKey: memvidKey } : undefined
    );

    // 2. Perform Search (Semantic + Lexical hybrid handled by Memvid if configured, usually just semantic with embedder)
    console.log("LOG: Searching memory...");
    const searchResult = await mv.find(message, {
      embedder,
      mode: "auto",
      k: 5,
      snippetChars: 2000,
    });

    const hits = searchResult.hits || [];
    console.log(`LOG: Found ${hits.length} relevant chunks`);

    // 3. Construct Context
    const context = hits
      .map((hit: any) => hit.snippet || "")
      .join("\n\n---\n\n");

    console.log("LOG: context:", context);

    // 4. Generate Answer – try models in order (see https://ai.google.dev/gemini-api/docs/models)
    console.log("LOG: Generating content...");
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
    INSTRUCTIONS:
    You are a Somali Quran Tafsir and Translation assistant.
    You ONLY answer questions about the Quran: its verses (aayaad), tafsir (interpretation), translation (tarjumaad), and Surah context.
    Do NOT answer questions about general Islamic topics, fiqh, siirada nabiga, or anything outside the Quran.
    Answer the question strictly based on the provided Context below.
    If the answer is not in the context, say: "${REFUSAL_MSG}"
    Do not invent information not present in the context.
    Language: Af-Soomaali.

    FORMATTING RULES:
    Always separate the Arabic text and the Somali tafsiir into distinct blocks for maximum clarity. Match the clean reference style.
    
    When displaying Quranic verses, use this EXACT format:

    ### Suurad [Surah Name] • Aayad [verse number]

    [Arabic Text]

    ---

    **Tafsiir:**
    [Somali Translation]

    ---

    RULES:
    1. NEVER use the word "Carabi" or labels like "Carabi:".
    2. NEVER use the word "Soomaali" as a label; use "**Tafsiir:**" instead.
    3. ALWAYS put the Arabic text centered and alone after the heading.
    4. Use "---" (horizontal rule) to separate the Arabic block from the Tafsiir.
    5. Ensure there are double newlines between everything.
    
    Keep your explanations clear and organized. Use proper headings (###), bold text (**), and spacing for readability.

    CONTEXT:
    ${context}

    QUESTION:
    ${message}
    `;

    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-pro"] as const;
    let lastError: unknown;
    for (const modelId of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = cleanTafsirResponse(responseText);
        console.log("LOG: Generation success");
        return NextResponse.json({
          text: responseText,
          sources: hits.map((h: any) => ({ title: h.title, score: h.score })),
        });
      } catch (err: any) {
        lastError = err;
        const is429 = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota");
        const is404 = err?.status === 404 || err?.message?.includes("404") || err?.message?.includes("not found");
        if (is429 && modelId !== modelsToTry[modelsToTry.length - 1]) continue;
        if (is404 && modelId !== modelsToTry[modelsToTry.length - 1]) continue;
        if (is429) {
          return NextResponse.json({
            text: "Xadka API (quota) waa la qaaday. Fadlan ku dayo dabayaaqad (sida daqiiqado yar) ama fiiri billing/plan-ka Google AI.",
          }, { status: 429 });
        }
        throw err;
      }
    }
    throw lastError;
  } catch (error) {
    console.error("Chat API Error Detailed:", error);
    const err = error as { status?: number; message?: string };
    if (err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota")) {
      return NextResponse.json({
        text: "Xadka API (quota) waa la qaaday. Fadlan ku dayo dabayaaqad.",
      }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
