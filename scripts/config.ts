/**
 * Shared config for SDK ingest. Paths and env for data/tafsiir.mv2 and data/quran.json.
 * Run from project root: bun run ingest
 */
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const DATA_DIR = path.join(process.cwd(), "data");
export const MEMORY_FILE = path.join(DATA_DIR, "tafsiir.mv2");
export const QURAN_JSON_PATH = path.join(DATA_DIR, "quran.json");

export const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";

export function getGeminiApiKey(): string | undefined {
  return process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
}

/** Memvid API key for memory creation / dashboard (mv2_...). See https://memvid.com/dashboard/api-keys */
export function getMemvidApiKey(): string | undefined {
  return process.env.MEMVID_API_KEY?.trim();
}
