#!/bin/sh

# Start Daphne (WebSocket server) on port 5000 in the background
echo "Starting Daphne (WebSocket server) on port 5000..."
daphne -b 0.0.0.0 -p 5000 greenpact.asgi:application &

# Wait a moment for Daphne to start
sleep 2

# Start Uvicorn (HTTP server) on port 8000
echo "Starting Uvicorn (HTTP server) on port 8000..."
exec uvicorn greenpact.asgi:application --host 0.0.0.0 --port 8000 --workers 4 --log-level debug
