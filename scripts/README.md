# Scripts

Ingest uses **`config.ts`** for paths and env: `data/tafsiir.mv2`, `data/quran.json`, `GOOGLE_API_KEY` / `GEMINI_API_KEY`, and **`MEMVID_API_KEY`** from `.env`.

## Ingest (SDK – for chat API)

Builds `data/tafsiir.mv2` from `data/quran.json` with **Gemini** embeddings. Required for the chat API.

```bash
bun run ingest
# or: npx tsx scripts/ingest.ts
```

**Required in `.env`:**
- `GOOGLE_API_KEY` or `GEMINI_API_KEY` – for Gemini embeddings
- `MEMVID_API_KEY` – Memvid API key (`mv2_...`) for memory creation. Get one at [memvid.com/dashboard/api-keys](https://memvid.com/dashboard/api-keys)
