import { getEmbedder } from "@memvid/sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const embedder = getEmbedder("gemini", { apiKey, model: "text-embedding-004" });
  
  try {
      // @ts-ignore
      const res = await embedder.embedQuery("Test query");
      console.log("Type:", typeof res);
      console.log("Is Array?", Array.isArray(res));
      if (Array.isArray(res)) {
          console.log("Length:", res.length);
          console.log("First element:", res[0]);
      } else {
          console.log("Structure:", JSON.stringify(res, null, 2));
      }
  } catch (e) {
      console.error(e);
  }
}

main().catch(console.error);
