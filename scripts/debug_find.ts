import { use } from "@memvid/sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
const MEMORY_FILE = path.join(process.cwd(), "data", "tafsiir_memory.mv2");

async function main() {
  const mv = await use("basic", MEMORY_FILE, { readOnly: true });
  
  console.log("Fetching all items...");
  try {
      // Find anything labelled 'tafsiir'
      const items = await mv.find({ where: { labels: { contains: "tafsiir" } } });
      console.log("Items found:", items.length);
      if (items.length > 0) {
          console.log("First item:", JSON.stringify(items[0], null, 2));
      }
  } catch (e) {
      console.error("Find failed:", e);
  }
}

main().catch(console.error);
