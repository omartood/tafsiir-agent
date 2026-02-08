import path from "path";
import fs from "fs";
// @ts-ignore
import pdfParse from "pdf-parse";

const PDF_DIR = path.join(process.cwd(), "pdf");

async function main() {
  const files = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  
  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    console.log(`📄 Analyzing: ${file}`);
    
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`\n--- PDF Metadata ---`);
    console.log(`Pages: ${pdfData.numpages}`);
    console.log(`Text length: ${pdfData.text.length} characters`);
    console.log(`\n--- First 2000 characters ---\n`);
    console.log(pdfData.text.slice(0, 2000));
    console.log(`\n--- Last 500 characters ---\n`);
    console.log(pdfData.text.slice(-500));
  }
}

main().catch(console.error);
