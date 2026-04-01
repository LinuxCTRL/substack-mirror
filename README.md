# Substack Mirror

A personal intelligence engine to mirror, archive, and analyze Substack newsletters.

## Features
- **Mirroring:** Automatically archive posts from any Substack publication.
- **Search:** Search through your local archive for specific keywords or topics.
- **"Zen Mode" Reader:** A distraction-free, elegant reading experience for your archive.
- **Offline Ready:** Store everything in a local SQLite database.
- **Elegant UI:** Soft palette and premium typography inspired by high-end newsletters.

## Quick Start (Unified)

### Linux / macOS
```bash
chmod +x start.sh
./start.sh
```

### Windows
```cmd
start.bat
```

## Manual Setup

### 1. Backend (Python)
```bash
cd backend
uv sync
cp .env.example .env
uv run uvicorn main:app --reload
```

### 2. Frontend (Next.js)
```bash
cd frontend
bun install
bun run dev
```

## Architecture
- **Worker:** Python-based scraper using Substack internal APIs.
- **Storage:** SQLite for local content persistence.
- **Frontend:** Next.js (App Router) with Vanilla CSS.
- **AI:** Google Gemini (Generative AI) for processing.
