# Frontend Docker Deployment

This guide explains how to deploy the GreenPact frontend using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)
- `.env` file with your environment variables

## Environment Variables Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your actual values:
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Your Gemini API key
   - `NEXT_PUBLIC_GEMINI_API_KEY2` - Your second Gemini API key
   - `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
   - `NEXT_PUBLIC_WEBSOCKET_URL` - WebSocket server URL

**Important:** The `.env` file is git-ignored for security. Never commit it to version control!

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f
```

3. Stop the container:
```bash
docker-compose down
```

### Option 2: Using Docker Commands

1. Build the image:
```bash
docker build -t greenpact-frontend .
```

2. Run the container:
```bash
docker run -p 3000:3000 --name greenpact-frontend greenpact-frontend
```

3. Stop the container:
```bash
docker stop greenpact-frontend
docker rm greenpact-frontend
```

## Environment Variables

If you need to add environment variables, create a `.env.local` file in the frontend directory and update the docker-compose.yml to include it:

```yaml
services:
  frontend:
    env_file:
      - .env.local
```

## Accessing the Application

Once the container is running, access the application at:
- http://localhost:3000

## Production Deployment

For production deployment to cloud platforms:

### Docker Hub
```bash
docker tag greenpact-frontend yourusername/greenpact-frontend:latest
docker push yourusername/greenpact-frontend:latest
```

### AWS ECR
```bash
aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com
docker tag greenpact-frontend:latest aws_account_id.dkr.ecr.region.amazonaws.com/greenpact-frontend:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/greenpact-frontend:latest
```

## Troubleshooting

### Container won't start
- Check logs: `docker-compose logs frontend`
- Ensure port 3000 is not already in use

### Build fails
- Clear Docker cache: `docker builder prune`
- Rebuild: `docker-compose build --no-cache`

### Out of memory during build
- Increase Docker memory allocation in Docker Desktop settings
- Or use multi-stage build optimization (already implemented)
