# Docker + Backend Connection Guide

## ✅ What Was Fixed

1. **Environment Variables at Build Time**: Added `ARG` and `ENV` in Dockerfile so `NEXT_PUBLIC_*` variables are available during build
2. **Docker Compose Build Args**: Configured docker-compose.yml to pass environment variables as build arguments
3. **Docker Networking**: Changed `localhost` to `host.docker.internal` so the Docker container can reach your host machine's backend

## 🔍 The Issue You Had

- **Error**: `POST http://localhost:3000/undefined/user/login`
- **Cause**: Environment variables weren't available at build time, so `process.env.NEXT_PUBLIC_BACKEND_URL` was `undefined`
- **Docker Network Issue**: `localhost` inside a container refers to the container itself, not your host machine

## 🚀 Current Configuration

**Frontend (Docker)**: http://localhost:3000
**Backend (Host)**: http://localhost:8000 (running on port 8000)
**WebSocket**: ws://localhost:5000 (running on port 5000)

### Connection Flow
```
Browser → Frontend (Docker:3000) → host.docker.internal:8000 → Backend (Host:8000)
```

## 🧪 Testing Your Setup

1. **Check Backend is Running** (from your screenshot, it's at port 8000):
   ```powershell
   curl http://localhost:8000/user/login/
   ```

2. **Test from Docker Container**:
   ```powershell
   docker exec greenpact-frontend wget -O- http://host.docker.internal:8000/user/login/
   ```

3. **View Container Logs**:
   ```powershell
   docker logs greenpact-frontend -f
   ```

4. **Check Environment Variables**:
   ```powershell
   docker exec greenpact-frontend printenv | Select-String "NEXT_PUBLIC"
   ```

## 🐛 If Still Having Issues

### Backend Not Accessible
If you still get connection errors, your backend might not be accepting connections from Docker. Make sure:

1. Backend is running on `0.0.0.0:8000` (not `127.0.0.1:8000`)
2. Check your backend's CORS settings allow requests from Docker
3. Windows Firewall isn't blocking Docker

### Check Backend CORS Settings
Your Django settings should include:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://host.docker.internal:3000",
]
```

## 🔄 After Making Changes

Rebuild the container:
```powershell
cd C:\Users\klaks\OneDrive\Desktop\GreenPact\frontend
docker compose down
docker compose up -d --build
```

## 📝 Note About Chatbot

Your chatbot with Gemini API should now work correctly because:
- ✅ `NEXT_PUBLIC_GEMINI_API_KEY` is set at build time
- ✅ `NEXT_PUBLIC_GEMINI_API_KEY2` is set at build time

Try accessing your app at http://localhost:3000 and test the login and chatbot features!
