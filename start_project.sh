#!/bin/bash

echo "======================================"
echo "STARTING PRIVACY PRESERVATION PROJECT"
echo "======================================"

(cd backend && node server.js) &

sleep 2

(source venv/bin/activate && python crypto_api.py) &

sleep 2

(cd frontend && npm run dev) &

echo ""
echo "======================================"
echo "ALL SERVICES STARTED"
echo "======================================"
echo "Frontend  : http://localhost:5173"
echo "======================================"

wait