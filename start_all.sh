#!/bin/bash
# ==============================================================================
# CampusIQ Platform - Unified Launch Script
# Starts MongoDB, Python FastAPI AI Service, Express Backend, and React Frontend
# ==============================================================================

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Starting CampusIQ Platform from $PROJECT_DIR..."

# 1. Start MongoDB if not already running
if ! nc -z 127.0.0.1 27017 2>/dev/null; then
    echo "[1/4] Starting MongoDB daemon..."
    mkdir -p "$PROJECT_DIR/data/db"
    mongod --dbpath "$PROJECT_DIR/data/db" --bind_ip 127.0.0.1 --port 27017 > "$PROJECT_DIR/data/mongod.log" 2>&1 &
    sleep 2
else
    echo "[1/4] MongoDB is already active on port 27017."
fi

# 2. Start Python FastAPI AI Service
echo "[2/4] Starting AI Service (FastAPI + RAG Engine)..."
cd "$PROJECT_DIR/ai_service"
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 > "$PROJECT_DIR/ai_service/ai_service.log" 2>&1 &
sleep 2

# 3. Start Backend
echo "[3/4] Starting Express Backend..."
cd "$PROJECT_DIR/backend"
node server.js > "$PROJECT_DIR/backend/backend.log" 2>&1 &
sleep 2

# 4. Start Frontend
echo "[4/4] Starting React Frontend..."
cd "$PROJECT_DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 5173 > "$PROJECT_DIR/frontend/frontend.log" 2>&1 &

echo ""
echo "================================================================="
echo "  CampusIQ Platform is successfully running!"
echo "  Frontend Application: http://localhost:5173"
echo "  Backend API Server:   http://localhost:5001"
echo "  AI RAG Service:       http://localhost:8000 (Docs: /docs)"
echo ""
echo "  Demo Credentials:"
echo "    Student Account: student@campusiq.edu / student123"
echo "    Admin Account:   admin@campusiq.edu   / admin123"
echo "================================================================="
