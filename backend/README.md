# Substack Mirror Backend

## Setup
1. Install dependencies using `uv`:
   ```bash
   uv sync
   ```
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your `GEMINI_API_KEY` to `.env`.

## Run
```bash
uv run uvicorn main:app --reload
```

## API Endpoints
- `POST /publications/{slug}`: Add a publication and sync its last 50 posts.
- `GET /publications`: List all mirrored publications.
- `GET /posts`: List all mirrored posts (with optional `publication_slug` filter).
- `GET /posts/search?q=keyword`: Search posts by title, content, or tags.
- `POST /sync/{slug}`: Manually trigger a sync for a publication.
