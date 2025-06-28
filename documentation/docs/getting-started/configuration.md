# ⚙️ Configuration Guide

This guide covers all configuration options for CodeBuddy, from basic environment setup to advanced customization options.

## 🏗️ Environment Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Database Configuration
APPLICATION_MONGO_URI=mongodb://localhost:27017
APPLICATION_MONGO_DB=codebuddy

# Redis Configuration
APPLICATION_REDIS_URL=redis://localhost:6379

# Security Configuration
APPLICATION_ENCRYPTION_KEY=your-super-secret-encryption-key-32-chars
JWT_SECRET_KEY=your-jwt-secret-key

# Server Configuration
APPLICATION_HOST=0.0.0.0
APPLICATION_PORT=8000
APPLICATION_UVICORN_WORKERS_COUNT=4

# CORS Configuration
APPLICATION_CORS_ALLOW_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

# Celery Configuration
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE_PATH=logs/app.log

# Application Settings
ENVIRONMENT=development
DEBUG=true
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# MongoDB Configuration (for NextAuth)
MONGODB_URI=mongodb://localhost:27017/codebuddy

# GitHub OAuth Configuration
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret

# Environment
NODE_ENV=development
```

## 🔐 Authentication Setup

### GitHub OAuth Application

1. **Create GitHub OAuth App**:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in the details:
     ```
     Application name: CodeBuddy
     Homepage URL: http://localhost:3000
     Authorization callback URL: http://localhost:3000/api/auth/callback/github
     ```

2. **Configure Environment Variables**:
   ```bash
   # Use the Client ID and Client Secret from GitHub
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### JWT Configuration

Generate secure secret keys:

```bash
# Generate a secure secret for JWT
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth secret
openssl rand -base64 32
```

## 🤖 AI Service Configuration

### OpenAI Configuration

```bash
# Get API key from https://platform.openai.com/account/api-keys
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Configure specific models
OPENAI_CHAT_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002
```

### Anthropic Configuration

```bash
# Get API key from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Optional: Configure specific models
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Model Configuration

Configure AI models in `backend/app/core/config.py`:

```python
class AIConfig:
    # Primary chat model
    CHAT_MODEL = "gpt-4"
    
    # Fallback models
    FALLBACK_MODELS = ["gpt-3.5-turbo", "claude-3-sonnet"]
    
    # Embedding model
    EMBEDDING_MODEL = "text-embedding-ada-002"
    
    # Model parameters
    MAX_TOKENS = 4000
    TEMPERATURE = 0.7
    
    # Rate limiting
    REQUESTS_PER_MINUTE = 60
    TOKENS_PER_MINUTE = 150000
```

## 🗄️ Database Configuration

### MongoDB Setup

#### Local MongoDB

```bash
# Install MongoDB
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongod

# Create database and user
mongo
> use codebuddy
> db.createUser({
    user: "codebuddy_user",
    pwd: "your_password",
    roles: ["readWrite"]
  })
```

#### MongoDB Atlas (Cloud)

```bash
# Connection string format
APPLICATION_MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abcdef.mongodb.net/codebuddy?retryWrites=true&w=majority
```

#### Connection Configuration

```python
# backend/app/core/database.py
from motor.motor_asyncio import AsyncIOMotorClient

class DatabaseConfig:
    MONGO_URI = os.getenv("APPLICATION_MONGO_URI")
    MONGO_DB = os.getenv("APPLICATION_MONGO_DB", "codebuddy")
    
    # Connection pool settings
    MAX_CONNECTIONS = 100
    MIN_CONNECTIONS = 10
    MAX_IDLE_TIME_MS = 30000
    
    # Index configurations
    INDEXES = {
        "users": ["email", "github_username"],
        "chats": ["user_id", "created_at"],
        "messages": ["chat_id", "created_at"],
        "diagrams": ["user_id", "created_at"],
        "embeddings": [
            ("repository_id", "file_path"),
            ("embeddings", "2dsphere")
        ]
    }
```

### Redis Configuration

#### Local Redis

```bash
# Install Redis
# macOS
brew install redis

# Ubuntu
sudo apt-get install redis-server

# Start Redis
redis-server

# Test connection
redis-cli ping
```

#### Redis Configuration

```python
# backend/app/core/cache.py
import redis

class RedisConfig:
    REDIS_URL = os.getenv("APPLICATION_REDIS_URL", "redis://localhost:6379")
    
    # Connection pool settings
    MAX_CONNECTIONS = 50
    RETRY_ON_TIMEOUT = True
    SOCKET_TIMEOUT = 5
    
    # Cache TTL settings
    DEFAULT_TTL = 3600  # 1 hour
    SESSION_TTL = 86400  # 24 hours
    EMBEDDING_TTL = 604800  # 1 week
    
    # Key prefixes
    SESSION_PREFIX = "session:"
    CHAT_PREFIX = "chat:"
    RATE_LIMIT_PREFIX = "rate:"
    TASK_PREFIX = "task:"
```

## 🔧 Advanced Configuration

### Celery Configuration

```python
# backend/app/celery/config.py
from celery import Celery

class CeleryConfig:
    broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Task routing
    task_routes = {
        'app.tasks.analyze_repository': {'queue': 'heavy'},
        'app.tasks.generate_embeddings': {'queue': 'medium'},
        'app.tasks.generate_diagram': {'queue': 'medium'},
        'app.tasks.cleanup_files': {'queue': 'light'},
    }
    
    # Worker configuration
    worker_max_tasks_per_child = 1000
    worker_prefetch_multiplier = 1
    task_acks_late = True
    
    # Task time limits
    task_soft_time_limit = 300  # 5 minutes
    task_time_limit = 600       # 10 minutes
    
    # Result expiration
    result_expires = 3600       # 1 hour
```

### Logging Configuration

```python
# backend/app/core/logging.py
import logging
from logging.handlers import RotatingFileHandler

class LoggingConfig:
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE_PATH = os.getenv("LOG_FILE_PATH", "logs/app.log")
    
    # File logging
    MAX_LOG_SIZE = 10 * 1024 * 1024  # 10MB
    BACKUP_COUNT = 5
    
    # Structured logging
    LOG_FORMAT = {
        "timestamp": "%(asctime)s",
        "level": "%(levelname)s",
        "module": "%(name)s",
        "message": "%(message)s",
        "request_id": "%(request_id)s",
        "user_id": "%(user_id)s"
    }
    
    # Log levels per module
    LOGGERS = {
        "app.agents": "DEBUG",
        "app.routers": "INFO",
        "app.services": "INFO",
        "uvicorn": "WARNING",
        "celery": "INFO"
    }
```

## 🚀 Production Configuration

### Environment Variables

```bash
# Production backend .env
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Database
APPLICATION_MONGO_URI=mongodb+srv://prod-user:secure-password@prod-cluster.mongodb.net/codebuddy
APPLICATION_REDIS_URL=redis://prod-redis:6379

# Security
APPLICATION_ENCRYPTION_KEY=super-secure-32-character-key-here
JWT_SECRET_KEY=super-secure-jwt-secret-key

# AI Services (with rate limiting)
OPENAI_API_KEY=sk-prod-key
ANTHROPIC_API_KEY=sk-ant-prod-key

# Server
APPLICATION_HOST=0.0.0.0
APPLICATION_PORT=8000
APPLICATION_UVICORN_WORKERS_COUNT=8

# CORS
APPLICATION_CORS_ALLOW_ORIGINS=["https://yourdomain.com", "https://api.yourdomain.com"]
```

### Docker Configuration

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
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1'
          memory: 2G
    restart: unless-stopped

  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.worker
    command: celery -A app.celery.worker worker --loglevel=info
    deploy:
      replicas: 4
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    deploy:
      resources:
        limits:
          memory: 2G
    volumes:
      - redis_data:/data
    restart: unless-stopped
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/codebuddy
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for AI processing
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # WebSocket support for real-time features
    location /ws/ {
        proxy_pass http://backend/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 Security Configuration

### SSL/TLS Setup

```bash
# Generate SSL certificate with Let's Encrypt
sudo certbot --nginx -d yourdomain.com

# Or use a custom certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/yourdomain.com.key \
  -out /etc/ssl/certs/yourdomain.com.crt
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Block direct access to application ports
sudo ufw deny 3000/tcp   # Frontend
sudo ufw deny 8000/tcp   # Backend
sudo ufw deny 6379/tcp   # Redis
sudo ufw deny 27017/tcp  # MongoDB
```

### Environment Security

```python
# backend/app/core/security.py
class SecurityConfig:
    # Password hashing
    BCRYPT_ROUNDS = 12
    
    # JWT settings
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_HOURS = 24
    JWT_REFRESH_DAYS = 30
    
    # Rate limiting
    RATE_LIMITS = {
        "chat": "100/hour",
        "diagram": "50/hour",
        "setup": "10/hour",
        "general": "1000/hour"
    }
    
    # Input validation
    MAX_MESSAGE_LENGTH = 10000
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES = [".py", ".js", ".ts", ".md", ".json", ".yaml"]
    
    # CORS settings
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
    CORS_ALLOW_HEADERS = ["*"]
```

## 📊 Monitoring Configuration

### Health Check Endpoints

```python
# backend/app/routers/health.py
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0",
        "dependencies": {
            "mongodb": await check_mongodb(),
            "redis": await check_redis(),
            "ai_services": await check_ai_services()
        }
    }
```

### Metrics Configuration

```python
# backend/app/core/metrics.py
from prometheus_client import Counter, Histogram, Gauge

# Request metrics
REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('request_duration_seconds', 'Request latency')

# AI metrics
AI_REQUESTS = Counter('ai_requests_total', 'AI requests', ['model', 'type'])
AI_LATENCY = Histogram('ai_request_duration_seconds', 'AI request latency')
AI_TOKENS = Counter('ai_tokens_total', 'AI tokens used', ['model', 'type'])

# System metrics
ACTIVE_USERS = Gauge('active_users', 'Currently active users')
QUEUE_SIZE = Gauge('celery_queue_size', 'Celery queue size', ['queue'])
```

## ⚙️ Performance Tuning

### Database Optimization

```javascript
// MongoDB indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "github_username": 1 })
db.chats.createIndex({ "user_id": 1, "created_at": -1 })
db.messages.createIndex({ "chat_id": 1, "created_at": -1 })
db.diagrams.createIndex({ "user_id": 1, "created_at": -1 })
db.embeddings.createIndex({ "repository_id": 1, "file_path": 1 })

// Text search index
db.embeddings.createIndex({
  "content": "text",
  "file_path": "text"
})

// Geospatial index for vector similarity
db.embeddings.createIndex({ "embeddings": "2dsphere" })
```

### Cache Configuration

```python
# backend/app/core/cache.py
class CacheConfig:
    # Cache TTL by type
    TTL_SETTINGS = {
        "user_session": 24 * 3600,      # 24 hours
        "chat_context": 4 * 3600,       # 4 hours
        "repository_analysis": 7 * 24 * 3600,  # 1 week
        "embeddings": 30 * 24 * 3600,   # 30 days
        "rate_limit": 3600,             # 1 hour
    }
    
    # Cache key patterns
    CACHE_KEYS = {
        "user": "user:{user_id}",
        "chat": "chat:{chat_id}",
        "repo": "repo:{repo_id}:analysis",
        "embeddings": "embeddings:{file_hash}",
        "rate_limit": "rate:{user_id}:{endpoint}"
    }
```

---

This configuration guide covers all aspects of setting up and tuning CodeBuddy for different environments. For specific deployment scenarios, refer to the Deployment Guide.