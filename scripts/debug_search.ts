import { use, getEmbedder } from "@memvid/sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MEMORY_FILE = path.join(process.cwd(), "data", "tafsiir_memory.mv2");

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const embedder = getEmbedder("gemini", { apiKey, model: "text-embedding-004" });
  
  console.log("Opening memory...");
  const mv = await use("basic", MEMORY_FILE, { readOnly: true });
  
  console.log("Embedding query...");
  // @ts-ignore
  const vector = await embedder.embedQuery("Yaa daabacay kitaabkan?");
  console.log("Vector length:", vector.length);
  
  console.log("Searching...");
  try {
      // @ts-ignore
      const results = await mv.vecSearch(vector, { k: 5 });
      console.log("Results found:", Array.isArray(results) ? results.length : "Unknown type");
      console.log(JSON.stringify(results, null, 2));
  } catch (e) {
      console.error("Search failed:", e);
  }
}

main().catch(console.error);
