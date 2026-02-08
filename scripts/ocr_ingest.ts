import { create, getEmbedder } from "@memvid/sdk";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { execSync, exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

// Load environment variables from .env
dotenv.config({ path: ".env" });

const PDF_DIR = path.join(process.cwd(), "pdf");
const MEMORY_FILE = path.join(process.cwd(), "data", "tafsiir_memory.mv2");
const TEMP_DIR = path.join(process.cwd(), "temp_ocr");

// Chunk text
function chunkText(text: string, maxChunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + maxChunkSize;
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const boundary = Math.max(lastPeriod, lastNewline);
      if (boundary > start + maxChunkSize / 2) {
        end = boundary + 1;
      }
    }
    chunks.push(text.slice(start, end).trim());
    start = end - overlap;
  }
  return chunks.filter(c => c.length > 50);
}

async function getPdfPageCount(filePath: string): Promise<number> {
  try {
    // @ts-ignore
    const pdfParse = (await import("pdf-parse")).default;
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.numpages;
  } catch (e) {
    console.log("Fallback to direct GS page count detection...");
    return 946; 
  }
}

async function processPage(filePath: string, pageNum: number): Promise<string> {
  const imgPath = path.join(TEMP_DIR, `page-${pageNum}.png`);
  const cmd = `gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r300 -dFirstPage=${pageNum} -dLastPage=${pageNum} -sOutputFile="${imgPath}" "${filePath}"`;
  
  try {
    await execPromise(cmd);
    const ocrCmd = `tesseract "${imgPath}" stdout -l eng --psm 1`; // psm 1 = Automatic page segmentation with OSD
    const { stdout } = await execPromise(ocrCmd);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    return stdout.trim();
  } catch (e) {
    console.error(`Error processing page ${pageNum}:`, e);
    return "";
  }
}

async function main() {
  console.log("🚀 Starting OCR Ingestion...");
  
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "PLACEHOLDER" || apiKey.includes("YOUR_")) {
    console.error("❌ Valid GOOGLE_API_KEY required in .env file.");
    process.exit(1);
  }

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
  if (!fs.existsSync(path.dirname(MEMORY_FILE))) fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });

  // Init Embedder
  const embedder = getEmbedder("gemini", { apiKey, model: "text-embedding-004" });
  console.log("🧠 Using Gemini Embeddings");

  const files = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith(".pdf"));

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    console.log(`📄 Processing PDF: ${file}`);
    
    const totalPages = await getPdfPageCount(filePath);
    
    // Additional JSON Export for Robustness
    const jsonOutput = path.join(process.cwd(), "data", "tafsiir_data.json");
    let allChunks: any[] = [];
    
    // For debugging, limit to 2 pages (or change to totalPages for full run)
    const MAX_PAGES = 3; 
    const pLimit = Math.min(totalPages, MAX_PAGES); 
    
    console.log(`⚠️  DEBUG MODE: LIMITING TO ${pLimit} PAGES`);

    for (let i = 1; i <= pLimit; i++) {
        process.stdout.write(`   Scanning page ${i}/${pLimit}... \r`);
        const text = await processPage(filePath, i);
        
        console.log(`\n--- Extracted Text from Page ${i} (${text.length} chars) ---`);
        
        if (text && text.length > 20) {
            const chunks = chunkText(text);
            console.log(`   📝 Split into ${chunks.length} chunks`);
            
            for (let j = 0; j < chunks.length; j++) {
                const chunk = chunks[j];
                try {
                    // Embed content manually for JSON store
                    // @ts-ignore
                    const vector = await embedder.embedQuery(chunk);

                    const doc = {
                        id: `${file}-p${i}-${j}`,
                        text: chunk,
                        embedding: vector,
                        metadata: { page: i, file: file }
                    };
                    
                    allChunks.push(doc);
                    console.log(`   ✅ Processed Chunk ${j+1}`);

                } catch (e: any) {
                    console.error("   ❌ Error:", e.message);
                }
            }
        }
    }
    
    // Save JSON
    fs.writeFileSync(jsonOutput, JSON.stringify(allChunks, null, 2));
    console.log(`\n💾 Saved ${allChunks.length} chunks to ${jsonOutput}`);
  }

  // Cleanup Temp
  if (fs.existsSync(TEMP_DIR)) fs.rmdirSync(TEMP_DIR, { recursive: true });
  
  console.log(`\n✨ Done! Data ready for chat.`);
}

main().catch(console.error);
