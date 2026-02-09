import { NextRequest, NextResponse } from "next/server";
import { open, getEmbedder } from "@memvid/sdk";
import path from "path";
import fs from "fs";

// Refusal template (Somali)
const REFUSAL_MSG =
  "Ma helin tafsiir cad oo ku saabsan su’aashan gudaha xusuusta la hayo. Sidaas darteed kama jawaabi karo anigoo aan hubin.";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes("PLACEHOLDER")) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // 1. Setup Memvid & Embedder (memory must be built with Gemini: bun run ingest)
    console.log("LOG: Initializing retrieval...");
    const memoryFile = path.join(process.cwd(), "data", "tafsiir.mv2");

    if (!fs.existsSync(memoryFile)) {
      console.warn(
        "LOG: Memory file not found, creating empty fallback context",
      );
      return NextResponse.json({
        text: "Nidaamku wali ma diyaarsana (Memory file missing). Fadlan maamulaha la xiriir.",
      });
    }

    const embedder = getEmbedder("gemini", {
      apiKey,
      model: "gemini-embedding-001",
    });
    const memvidKey = process.env.MEMVID_API_KEY?.trim();
    const mv = await open(
      memoryFile,
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

    // 4. Generate Answer using Gemini directly
    console.log("LOG: Generating content...");
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    INSTRUCTIONS:
    You are a Somali Quran Tafsir and Translation assistant.
    You ONLY answer questions about the Quran: its verses (aayaad), tafsir (interpretation), translation (tarjumaad), and Surah context.
    Do NOT answer questions about general Islamic topics, fiqh, siirada nabiga, or anything outside the Quran.
    Answer the question strictly based on the provided Context below.
    If the answer is not in the context, say: "${REFUSAL_MSG}"
    Do not invent information not present in the context.
    Language: Af-Soomaali.

    CONTEXT:
    ${context}

    QUESTION:
    ${message}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log("LOG: Generation success");

    return NextResponse.json({
      text: responseText,
      sources: hits.map((h: any) => ({ title: h.title, score: h.score })),
    });
  } catch (error) {
    console.error("Chat API Error Detailed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
