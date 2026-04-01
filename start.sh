#!/bin/bash

# Substack Mirror - Unified Launcher (Linux/macOS)

# Colors for better visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}>>> Starting Substack Mirror...${NC}"

# Check for .env in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${GREEN}>>> Initializing backend environment...${NC}"
    cp backend/.env.example backend/.env
fi

# Function to stop both processes on Ctrl+C
cleanup() {
    echo -e "\n${BLUE}>>> Stopping Substack Mirror...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

# Start Backend
echo -e "${GREEN}>>> Starting Backend (FastAPI)...${NC}"
cd backend
uv run uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo -e "${GREEN}>>> Starting Frontend (Next.js)...${NC}"
cd frontend
bun run dev &
FRONTEND_PID=$!
cd ..

echo -e "${BLUE}>>> Services started!${NC}"
echo -e "${BLUE}>>> Backend: http://localhost:8000${NC}"
echo -e "${BLUE}>>> Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}>>> Press Ctrl+C to stop both services.${NC}"

# Wait for processes
wait
