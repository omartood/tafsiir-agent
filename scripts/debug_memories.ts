import { use } from "@memvid/sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const MEMORY_FILE = path.join(process.cwd(), "data", "tafsiir_memory.mv2");

async function main() {
  const mv = await use("basic", MEMORY_FILE, { readOnly: true });
  
  console.log("Fetching memories...");
  try {
      // @ts-ignore
      const items = await mv.memories();
      console.log("Items found:", items.length);
      if (items.length > 0) {
          console.log("First item:", JSON.stringify(items[0], null, 2));
      }
  } catch (e) {
      console.error("Memories fetch failed:", e);
  }
}

main().catch(console.error);
