@echo off
setlocal

echo >>> Starting Substack Mirror...

:: Initialize backend .env if missing
if not exist "backend\.env" (
    echo >>> Initializing backend environment...
    copy "backend\.env.example" "backend\.env"
)

:: Start Backend in a new window
echo >>> Starting Backend (FastAPI)...
start "Substack Mirror Backend" cmd /c "cd backend && uv run uvicorn main:app --reload --port 8000"

:: Start Frontend in a new window
echo >>> Starting Frontend (Next.js)...
start "Substack Mirror Frontend" cmd /c "cd frontend && bun run dev"

echo >>> Services are starting in separate windows...
echo >>> Backend: http://localhost:8000
echo >>> Frontend: http://localhost:3000
echo >>> Close the windows or press Ctrl+C in them to stop.

pause
