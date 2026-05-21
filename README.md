# 🧠 Offline RAG Assistant

> A fully local, privacy-first Retrieval-Augmented Generation (RAG) system. Upload documents, ask natural language questions, get cited answers — entirely on your machine. No API keys. No internet. No data leaves your device.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![LangChain](https://img.shields.io/badge/LangChain-0.2-orange?style=flat-square)
![ChromaDB](https://img.shields.io/badge/ChromaDB-0.5-purple?style=flat-square)
![Ollama](https://img.shields.io/badge/Ollama-Qwen3-black?style=flat-square)
![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)

---

## 📌 Overview

Offline RAG Assistant transforms your documents into a queryable knowledge base using semantic search and a locally running LLM. It operates in two phases:

- **Ingestion** — Upload a PDF or Word file. The system extracts text, chunks it intelligently, embeds each chunk using Sentence-Transformers, and stores the vectors in ChromaDB.
- **Retrieval** — Ask a question. The system embeds your query, retrieves the top-5 most semantically relevant chunks using MMR, constructs a grounded prompt, and sends it to Ollama (Qwen3) for answer generation — with source citations.

Everything runs offline. No OpenAI. No cloud.

<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/29b2c21a-06b0-46c7-ae8e-4f5cc2626b00" />

<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/9351a92e-e2ad-426e-8828-8f1ae4129625" />

---

## ✨ Features

- 📄 **Multi-format support** — PDF and Word (.docx) document ingestion
- 🔍 **Semantic search** — Embedding-based retrieval via `all-MiniLM-L6-v2`
- 🎯 **MMR retrieval** — Maximal Marginal Relevance ensures diverse, non-redundant results
- 🤖 **Local LLM** — Qwen3 running via Ollama, fully offline
- 📚 **Source citations** — Every answer cites the filename and page number it used
- 🚫 **No hallucination prompt** — LLM is strictly instructed to answer only from provided context
- 💾 **Persistent vector store** — ChromaDB persists embeddings to disk across sessions
- 🎨 **Glassmorphism UI** — Deep space themed React frontend with Framer Motion animations

---

## 🏗️ Architecture

```
User (React UI)
      │
      ▼
FastAPI Backend
      │
      ├── Ingestion Pipeline
      │       ├── PyMuPDF / python-docx  → text extraction with page numbers
      │       ├── RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
      │       ├── all-MiniLM-L6-v2  → chunk embeddings
      │       └── ChromaDB  → persistent vector storage
      │
      └── Retrieval Pipeline
              ├── all-MiniLM-L6-v2  → query embedding
              ├── ChromaDB MMR search  → top-5 diverse chunks
              ├── Prompt construction  → context + question
              └── Ollama (Qwen3)  → grounded answer generation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| Backend | Python 3.10+, FastAPI, LangChain |
| Document Parsing | PyMuPDF, python-docx |
| Embeddings | Sentence-Transformers (`all-MiniLM-L6-v2`) |
| Vector Store | ChromaDB (persistent, local) |
| LLM | Ollama — Qwen3 (fully local) |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running

### 1. Clone the repository

```bash
git clone https://github.com/tanaysingh0312/offline-rag-assistant.git
cd offline-rag-assistant
```

### 2. Pull the Qwen3 model via Ollama

```bash
ollama pull qwen3
```

### 3. Set up the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app

```
http://localhost:5173
```

Upload a PDF or Word document, wait for ingestion to complete, then start asking questions.

---

## 📁 Project Structure

```
offline-rag-assistant/
├── backend/
│   ├── main.py               # FastAPI app — upload & query endpoints
│   ├── ingest.py             # Document ingestion pipeline
│   ├── retrieval.py          # Retrieval, MMR, prompt construction
│   ├── requirements.txt      # Python dependencies
│   └── chroma_db/            # Persistent ChromaDB storage (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Configuration

Key parameters in `backend/ingest.py`:

```python
CHUNK_SIZE = 1000        # Characters per chunk
CHUNK_OVERLAP = 200      # Overlap between chunks
TOP_K = 5                # Number of chunks retrieved per query
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
OLLAMA_MODEL = "qwen3"
```

---

## 💡 Design Principles

- **Grounded responses only** — LLM is prompted to never answer outside the provided context
- **Local inference** — All processing happens on your machine; no data is sent externally
- **Embedding model consistency** — Same model used at ingestion and retrieval time to ensure vector compatibility
- **Metadata-aware chunking** — Every chunk carries source filename and page number for accurate citation
- **Modular architecture** — Ingestion, retrieval, and generation are fully decoupled

---

## 📸 Screenshots

> UI screenshots coming soon.

---

## 🤝 Contributors

| Name | Role |
|---|---|
| [Tanay Singh](https://github.com/tanaysingh0312) | AI / Backend Development |


---

## 📄 License

Licensed under the [Apache License 2.0](LICENSE).

---

## ⭐ If this helped you

Give it a star on GitHub — it helps others find the project.
