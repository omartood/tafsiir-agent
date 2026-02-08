import { create, getEmbedder } from "@memvid/sdk";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config({ path: ".env" });

const MEMORY_FILE = path.join(process.cwd(), "data", "tafsiir_memory.mv2");

async function main() {
  console.log("🚀 Starting ingestion (Local JSON approach)...");

  // Validate API key
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER" || apiKey.includes("YOUR_")) {
    console.error("❌ Valid GOOGLE_API_KEY required in .env file.");
    process.exit(1);
  }

  // Ensure data directory exists
  if (!fs.existsSync(path.dirname(MEMORY_FILE))) {
    fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
  }

  // Delete existing memory
  if (fs.existsSync(MEMORY_FILE)) {
    console.log(`🗑️  Deleting existing memory file: ${MEMORY_FILE}`);
    fs.unlinkSync(MEMORY_FILE);
  }

  console.log(`📦 Creating memory file: ${MEMORY_FILE}`);
  const mv = await create(MEMORY_FILE);
  
  // Setup Embedder with API key
  const embedder = getEmbedder("gemini", {
    apiKey: apiKey,
    model: "gemini-embedding-001"
  });
  console.log("🧠 Using Gemini Embeddings (gemini-embedding-001)");

  try {
    // Load Quran Data from Local JSON
    const localJsonPath = path.join(process.cwd(), "data", "quran.json");
    console.log(`📖 Loading Quran JSON from: ${localJsonPath}`);
    
    if (!fs.existsSync(localJsonPath)) {
        throw new Error(`File not found: ${localJsonPath}`);
    }

    const fileContent = fs.readFileSync(localJsonPath, "utf-8");
    const rawData = JSON.parse(fileContent);
    
    const verses: any[] = [];
    
    // Iterate over Surah keys (1, 2, ..., 114)
    Object.keys(rawData).forEach(suraKey => {
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
                    id: v.id 
                });
            });
        }
    });

    console.log(`   📝 Parsed ${verses.length} verses from local JSON`);

    // Ingest into Memvid
    const CHUNK_SIZE = 5;
    let chunksIngested = 0;

    for (let i = 0; i < verses.length; i += CHUNK_SIZE) {
      const chunkVerses = verses.slice(i, i + CHUNK_SIZE);
      const startVerse = chunkVerses[0];
      const endVerse = chunkVerses[chunkVerses.length - 1];
      
      const chunkText = chunkVerses.map(v => `[Surah ${v.chapter}:${v.verse}]\n${v.text}`).join("\n\n---\n\n");
      const title = `Surah ${startVerse.chapter}, Verses ${startVerse.verse}-${endVerse.verse} (Somali)`;

      if (chunksIngested === 0) {
          console.log(`Debug: First chunk length: ${chunkText.length}`);
          console.log(`Debug: First chunk preview:\n${chunkText.slice(0, 200)}...`);
      }

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
                dimension: embedder.dimension
            }
        });
        
        chunksIngested++;
        
         // Progress indicator every 20 chunks
        if (chunksIngested % 20 === 0) {
          console.log(`   ⏳ Processed ${chunksIngested} chunks (${i + CHUNK_SIZE}/${verses.length} verses)...`);
        }

        // Rate limit delay (4 seconds for safety)
        await new Promise(resolve => setTimeout(resolve, 4000));

      } catch (chunkError) {
        console.error(`   ⚠️ Failed chunk for ${title}:`, (chunkError as Error).message);
        // Add longer delay on error
        await new Promise(resolve => setTimeout(resolve, 5000));
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
