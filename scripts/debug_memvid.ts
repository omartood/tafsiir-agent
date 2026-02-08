import { use, getEmbedder } from "@memvid/sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const embedder = getEmbedder("gemini", { apiKey, model: "text-embedding-004" });
  
  console.log("Embedder keys:", Object.keys(embedder));
  console.log("Embedder prototype:", Object.getOwnPropertyNames(Object.getPrototypeOf(embedder)));
  
  // Try to test embedding
  try {
      // @ts-ignore
      console.log("Testing embedQuery...");
      const result = await embedder.embedQuery("test message");
      console.log("Success! Result length:", result.length);
  } catch (e: any) {
      console.error("Embedding ERROR:", e.message);
      if (e.response) {
          console.error("Response data:", JSON.stringify(e.response, null, 2));
      }
  }
}

main().catch(console.error);
