import { create, getEmbedder } from "@memvid/sdk";
import path from "path";
import fs from "fs";
import {
  MEMORY_FILE,
  QURAN_JSON_PATH,
  DATA_DIR,
  GEMINI_EMBEDDING_MODEL,
  getGeminiApiKey,
  getMemvidApiKey,
} from "./config";

async function main() {
  console.log("🚀 Ingest: data/quran.json → data/tafsiir.mv2 (Gemini embeddings)");

  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey === "PLACEHOLDER" || apiKey.includes("YOUR_")) {
    console.error("❌ GOOGLE_API_KEY or GEMINI_API_KEY required in .env");
    process.exit(1);
  }

  const memvidKey = getMemvidApiKey();
  if (!memvidKey || !memvidKey.startsWith("mv2_")) {
    console.error("❌ MEMVID_API_KEY (mv2_...) required in .env for memory creation. Get one at https://memvid.com/dashboard/api-keys");
    process.exit(1);
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(MEMORY_FILE)) {
    console.log(`🗑️  Deleting existing: ${MEMORY_FILE}`);
    fs.unlinkSync(MEMORY_FILE);
  }

  console.log(`📦 Creating memory file (MEMVID_API_KEY): ${MEMORY_FILE}`);
  const mv = await create(MEMORY_FILE, "basic", { memvidApiKey: memvidKey });

  const embedder = getEmbedder("gemini", {
    apiKey,
    model: GEMINI_EMBEDDING_MODEL,
  });
  console.log(`🧠 Embedder: ${GEMINI_EMBEDDING_MODEL}`);

  try {
    if (!fs.existsSync(QURAN_JSON_PATH)) {
      throw new Error(`File not found: ${QURAN_JSON_PATH}`);
    }
    const fileContent = fs.readFileSync(QURAN_JSON_PATH, "utf-8");
    const rawData = JSON.parse(fileContent);

    const verses: any[] = [];

    // Iterate over Surah keys (1, 2, ..., 114)
    Object.keys(rawData).forEach((suraKey) => {
      const suraData = rawData[suraKey];
      if (suraData && Array.isArray(suraData.result)) {
        suraData.result.forEach((v: any) => {
          // Combine relevant fields
          const combinedText = `
Arabic: ${v.arabic_text}
Somali: ${v.translation}
Footnotes: ${v.footnotes}
`.trim();
          verses.push({
            chapter: parseInt(v.sura),
            verse: parseInt(v.aya),
            text: combinedText,
            // Keep track of IDs for later verification if needed
            id: v.id,
          });
        });
      }
    });

    console.log(`   📝 Parsed ${verses.length} verses from local JSON`);

    // Ingest into Memvid (larger chunks = fewer API calls; 1s delay = ~10 min total)
    const CHUNK_SIZE = 10;
    let chunksIngested = 0;

    for (let i = 0; i < verses.length; i += CHUNK_SIZE) {
      const chunkVerses = verses.slice(i, i + CHUNK_SIZE);
      const startVerse = chunkVerses[0];
      const endVerse = chunkVerses[chunkVerses.length - 1];

      const chunkText = chunkVerses
        .map((v) => `[Surah ${v.chapter}:${v.verse}]\n${v.text}`)
        .join("\n\n---\n\n");
      const title = `Surah ${startVerse.chapter}, Verses ${startVerse.verse}-${endVerse.verse} (Somali)`;

      try {
        // Manual embedding to ensure control and avoid putMany() issues
        const vector = await embedder.embedQuery(chunkText);

        await mv.put({
          title: title,
          text: chunkText,
          labels: ["tafsiir", "quran", `surah-${startVerse.chapter}`],
          embedding: vector,
          embeddingIdentity: {
            provider: embedder.provider,
            model: embedder.modelName,
            dimension: embedder.dimension,
          },
        });

        chunksIngested++;

        // Progress indicator every 20 chunks
        if (chunksIngested % 20 === 0) {
          console.log(
            `   ⏳ Processed ${chunksIngested} chunks (${i + CHUNK_SIZE}/${verses.length} verses)...`,
          );
        }

        // Rate limit delay (1s; reduce if you hit Gemini limits)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (chunkError) {
        console.error(
          `   ⚠️ Failed chunk for ${title}:`,
          (chunkError as Error).message,
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log(`✅ Successfully ingested ${chunksIngested} chunks`);
  } catch (error) {
    console.error(`❌ Failed to process JSON:`, error);
  }

  // Seal
  console.log("🔒 Sealing memory file...");
  await mv.seal();

  // Verification
  const stats = await mv.stats();
  console.log("\n📊 Stats:");
  console.log(`   - Documents ingested: ${stats.frame_count}`);
  console.log(`   - Size: ${stats.size_bytes} bytes`);
  console.log(`\n✨ Ingestion complete! Memory stored at: ${MEMORY_FILE}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
