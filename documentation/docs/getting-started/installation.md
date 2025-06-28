# 🛠️ Installation Guide

This comprehensive guide will help you install and configure CodeBuddy in various environments, from development to production.

## 📋 Prerequisites

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **RAM** | 4GB | 8GB+ |
| **CPU** | 2 cores | 4+ cores |
| **Storage** | 10GB | 50GB+ |
| **OS** | Linux, macOS, Windows | Linux (Ubuntu 20.04+) |

### Required Software

- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Git** for cloning the repository
- **Node.js** 18+ (for local development)
- **Python** 3.9+ (for local development)

### External Services

- **GitHub Account** for repository integration
- **OpenAI API Key** or **Anthropic API Key** for AI features
- **MongoDB** (can use Docker or cloud service)
- **Redis** (can use Docker or cloud service)

## 🚀 Quick Installation (Docker)

The fastest way to get CodeBuddy running is with Docker Compose.

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/codebuddy.git
cd codebuddy
```

### 2. Environment Configuration

Create environment files from templates:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment  
cp frontend/.env.example frontend/.env.local
```

### 3. Configure Environment Variables

**Backend (.env)**:
```env
# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Database Configuration
MONGODB_URL=mongodb://mongodb:27017/codebuddy
REDIS_URL=redis://redis:6379

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET_KEY=another-secret-key-for-jwt-tokens

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Application Settings
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# Celery Configuration
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

**Frontend (.env.local)**:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# GitHub OAuth (if using)
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret

# Environment
NODE_ENV=development
```

### 4. Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 5. Verify Installation

```bash
# Health checks
curl http://localhost:8000/health
curl http://localhost:3000

# API documentation
open http://localhost:8000/docs

# Frontend application
open http://localhost:3000
```

## 🔧 Local Development Setup

For development and customization, set up services locally.

### Backend Setup

#### 1. Python Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate environment
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

#### 2. Database Setup

**Option A: Docker (Recommended)**
```bash
# Start MongoDB
docker run -d --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:6.0

# Start Redis
docker run -d --name redis \
  -p 6379:6379 \
  redis:7.0-alpine
```

**Option B: Local Installation**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb redis-server

# macOS with Homebrew
brew install mongodb-community redis

# Start services
sudo systemctl start mongod redis-server  # Linux
brew services start mongodb-community redis  # macOS
```

#### 3. Environment Configuration

```bash
# Copy and edit environment file
cp .env.example .env
nano .env  # or your preferred editor
```

#### 4. Database Migration

```bash
# Initialize database
python scripts/init_db.py

# Create indexes
python scripts/create_indexes.py
```

#### 5. Start Backend Services

```bash
# Start API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# In another terminal, start Celery worker
celery -A app.core.celery worker --loglevel=info

# In another terminal, start Celery beat (scheduler)
celery -A app.core.celery beat --loglevel=info
```

### Frontend Setup

#### 1. Node.js Dependencies

```bash
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install
```

#### 2. Environment Configuration

```bash
# Copy and edit environment file
cp .env.example .env.local
nano .env.local
```

#### 3. Start Development Server

```bash
# Start Next.js development server
npm run dev

# Or with yarn
yarn dev
```

## 🐳 Docker Configuration

### Custom Docker Compose

Create a custom `docker-compose.override.yml` for local modifications:

```yaml
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
    environment:
      - DEBUG=true
      - LOG_LEVEL=DEBUG
    ports:
      - "8001:8000"  # Use different port if needed

  frontend:
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001

  mongodb:
    volumes:
      - ./data/mongodb:/data/db
    ports:
      - "27018:27017"  # Use different port if needed

  redis:
    volumes:
      - ./data/redis:/data
    ports:
      - "6380:6379"  # Use different port if needed
```

### Production Docker Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Using AWS ECS

```bash
# Build and push images
docker build -t codebuddy-backend ./backend
docker build -t codebuddy-frontend ./frontend

# Tag for ECR
docker tag codebuddy-backend:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/codebuddy-backend:latest
docker tag codebuddy-frontend:latest 123456789012.dkr.ecr.us-west-2.amazonaws.com/codebuddy-frontend:latest

# Push to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-west-2.amazonaws.com
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/codebuddy-backend:latest
docker push 123456789012.dkr.ecr.us-west-2.amazonaws.com/codebuddy-frontend:latest
```

#### ECS Task Definition

```json
{
  "family": "codebuddy",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "123456789012.dkr.ecr.us-west-2.amazonaws.com/codebuddy-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "MONGODB_URL",
          "value": "mongodb://mongodb-cluster.cluster-abc123.us-west-2.docdb.amazonaws.com:27017/codebuddy"
        },
        {
          "name": "REDIS_URL", 
          "value": "redis://codebuddy-redis.abc123.cache.amazonaws.com:6379"
        }
      ],
      "secrets": [
        {
          "name": "OPENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-west-2:123456789012:secret:codebuddy/openai-key"
        }
      ]
    }
  ]
}
```

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and submit to Cloud Build
gcloud builds submit --tag gcr.io/your-project/codebuddy-backend ./backend
gcloud builds submit --tag gcr.io/your-project/codebuddy-frontend ./frontend

# Deploy to Cloud Run
gcloud run deploy codebuddy-backend \
  --image gcr.io/your-project/codebuddy-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy codebuddy-frontend \
  --image gcr.io/your-project/codebuddy-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### Docker Issues
```bash
# Clean up Docker
docker system prune -a

# Reset volumes
docker-compose down -v
```

#### Permission Issues
```bash
# Fix file permissions
chmod +x scripts/*.sh
sudo chown -R $USER:$USER ./data/
```

### Getting Help

- Check the [troubleshooting guide](../troubleshooting)
- Review logs with `docker-compose logs`
- Visit our [GitHub Issues](https://github.com/your-org/codebuddy/issues)

---

**Next Steps**: Once installation is complete, check out the [Configuration Guide](./configuration) to customize your setup!