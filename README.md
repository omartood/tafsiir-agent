# Somali Tafsiir Agent 🌙

An AI-powered Somali Quran Tafsiir assistant that provides grounded, accurate answers from the Somali Quranic interpretation (Tafsiir). Built with a focus on speed, reliability, and Somali language precision.

---

## 🚀 Key Features

- **Semantic Intelligence**: Understands religious context and Somali terminology using `gemini-embedding-001`.
- **Hybrid Retrieval**: Powered by **[Memvid](https://memvid.com)**, combining vector similarity with lexical (keyword) matching to ensure exact verse lookups.
- **Accurate Grounding**: Answers are strictly grounded in provided tafsiir data to prevent hallucinations.
- **Modern UI**: A premium, responsive interface featuring Islamic-inspired aesthetics and dark mode support.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Vector Memory**: [@memvid/sdk](https://www.npmjs.com/package/@memvid/sdk) (Local `.mv2` storage)
- **LLM**: [Google Gemini 2.0 Flash](https://aistudio.google.com/)

---

## 📁 Project Structure

- **`src/app/`**: Application routes and Chat API logic.
- **`src/components/`**: Reusable UI components (Sidebar, Message bubbles).
- **`data/`**: Stores source JSON (`quran.json`) and the Memvid database (`tafsiir.mv2`).
- **`scripts/`**: Development tools for data ingestion and debugging.
- **`pdf/`**: Original Somali Quran PDF documents.

---

## ⚙️ Getting Started

### 1. Prerequisites

- Node.js 18+
- A Google Gemini API Key

### 2. Setup

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Data Ingestion

Before the chat works, you must process the data into the Memvid memory:

```bash
# Ingest data into tafsiir.mv2
npx tsx scripts/ingest.ts
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 📡 Public Quran API

The app exposes a **public REST API** for the Quran JSON (Arabic + Somali translation):

| Endpoint                         | Description                    |
| -------------------------------- | ------------------------------ |
| `GET /api/quran`                 | API info and usage             |
| `GET /api/quran/surahs`          | List all 114 surahs (metadata) |
| `GET /api/quran?surah=1`         | All verses of surah 1          |
| `GET /api/quran?surah=1&ayah=2`  | Single verse (surah 1, ayah 2) |
| `GET /api/quran/surahs/1`        | Same as above (path style)     |
| `GET /api/quran/surahs/1?ayah=2` | Single verse (path style)      |

No authentication required. Full documentation: **[API Docs](/docs)** (or open `/docs` in the running app).

---

## 📖 Related Documents

- [Walkthrough](.gemini/antigravity/brain/a1a13f43-125b-4c30-b80c-a2c8304b1498/walkthrough.md): Technical details of the retrieval logic and fixes.
- [Task Log](.gemini/antigravity/brain/a1a13f43-125b-4c30-b80c-a2c8304b1498/task.md): Current development status and milestones.

---

## 📝 License

MIT License - Created for the Somali AI Community.
