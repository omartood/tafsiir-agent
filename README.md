<div align="center">
  <img src="public/logo.svg" alt="Logo" width="100">

  # Somali Tafsiir Agent

  > **A high-performance, AI-driven assistant for Somali Quranic Tafsiir.**

  [![Framework](https://img.shields.io/badge/Framework-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![AI Model](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-blue?style=flat-square&logo=google-gemini)](https://aistudio.google.com/)
  [![Vector DB](https://img.shields.io/badge/Memory-Memvid-8a2be2?style=flat-square)](https://memvid.com)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
</div>

An AI-powered Somali Quran Tafsiir assistant that provides grounded, accurate answers from Somali Quranic interpretation. Designed for the Somali AI community to make religious knowledge more accessible through state-of-the-art retrieval technology.

---

## 📖 Knowledge Base & Support

### 🧠 Model Memory
The intelligence of this agent is anchored by `data/trained.json`. This dataset serves as the primary source for creating the model's semantic memory, ensuring that every response is derived from authenticated Somali Tafsiir.

### 🎯 Supported Scope
*   **Current AI Agent Focus**: Optimized for **Surah Al-Fatiha** and the **30th Juz (Juz Amma)**.
*   **System Capability**: While the AI agent is currently tuned for these sections, the underlying **API and architecture support the entire Holy Quran (all 114 Surahs)**. You can easily extend the agent's memory to include the full Quran.

---

## ✨ Key Features

- **🎯 Semantic Precision**: Leverages `gemini-embedding-001` to understand deep religious context and Somali nuances.
- **⚡ Hybrid Retrieval**: Integrates **[Memvid](https://memvid.com)** for a powerful combination of vector similarity and lexical matching, ensuring exact verse lookups.
- **🛡️ Hallucination-Free**: strictly grounded in provided tafsiir data. If the information isn't in the context, the agent won't invent it.
- **📱 Premium Experience**: A modern, responsive interface with Islamic-inspired aesthetics, smooth micro-animations, and full dark mode support.

---

## 🛠 Tech Stack

- **Core**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Modern CSS engine)
- **Vector Memory**: [@memvid/sdk](https://www.npmjs.com/package/@memvid/sdk) (Local `.mv2` storage)
- **Intelligence**: [Google Gemini 2.0 Flash](https://aistudio.google.com/)
- **Data Source**: Custom Somali Tafsiir JSON (`data/trained.json`)

---

## 📁 Project Structure

```bash
├── data/           # Model memory source (trained.json) & Memvid DB
├── src/
│   ├── app/        # Chat API logic and application routes
│   └── components/ # UI Components (Sidebar, Messaging, etc.)
├── scripts/        # Ingestion and development tools
└── public/         # Static assets and religious icons
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/)

### 2. Setup
```bash
git clone https://github.com/your-repo/tafsiir-agent.git
cd tafsiir-agent
npm install
```

### 3. Environment
Create a `.env` file in the root:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 4. Initialize Memory
Process the `trained.json` data into the high-speed Memvid vector database:
```bash
npm run ingest
```

### 5. Launch
```bash
npm run dev
```

---

## 📡 Modern Quran API

The platform includes a robust **Public REST API** for accessing the Quran (Arabic + Somali translation) programmatically.

| Endpoint | Action |
| :--- | :--- |
| `GET /api/quran/surahs` | List all 114 Surahs |
| `GET /api/quran?surah=X` | Get all verses of Surah X |
| `GET /api/quran?surah=X&ayah=Y` | Get single verse (Surah X, Ayah Y) |

*Full documentation available at `/docs` in the running application.*

---

## 🤝 Contributing
Created for the **Somali AI Community**. Help us bridge tradition and technology.

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
