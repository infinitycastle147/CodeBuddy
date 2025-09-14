# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Development Commands

```bash
# Docker Compose (recommended for development)
docker-compose up --build

# Development server (standalone)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Background tasks (if not using Docker)
celery -A app.celery_config.worker.celery_app worker --loglevel=info --concurrency=2

# Testing
pytest app/tests/

# Dependencies
pip install -r requirements.txt
```

## Architecture

**Core Stack**: FastAPI + MongoDB + Redis + Celery + Google ADK

### Key Components
- **API Layer** (`app/routers/`): Chat, Diagram, User, and Setup endpoints
- **Agent System** (`app/agents/`): Multi-agent AI workflows for chat and diagram generation
- **Data Layer** (`app/models/`, `app/repositories/`): Pydantic models with repository pattern
- **Authentication** (`app/auth/`): NextAuth session validation with resource ownership
- **Utilities** (`app/utils/`): GitHub integration, embeddings, XML processing

### Technology Stack
- **FastAPI**: Web framework with OpenAPI docs
- **Google ADK**: Agent Development Kit for AI workflows
- **MongoDB + Motor**: Async NoSQL database
- **Celery + Redis**: Background task processing
- **Sentence Transformers**: Code search embeddings
- **NextAuth**: Session-based authentication

## Environment Variables

```bash
# Database
APPLICATION_MONGO_URI=mongodb://localhost:27017  # Docker: mongodb://mongo:27017
APPLICATION_MONGO_DB=codebuddy

# Redis
APPLICATION_REDIS_URL=redis://localhost:6379  # Docker: redis://redis:6379

# Security
APPLICATION_ENCRYPTION_KEY=your-encryption-key  # Generate with: openssl rand -hex 32

# Server
APPLICATION_HOST=0.0.0.0
APPLICATION_PORT=8000
APPLICATION_CORS_ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret  # Must match frontend
NEXTAUTH_URL=http://localhost:3000  # Frontend URL

# API Keys (for AI agents)
# Configure in app/agents/ configuration files
```

## Authentication Flow

1. **Frontend**: NextAuth manages login/sessions
2. **Backend**: Validates sessions via NextAuth API (`/api/auth/session`)
3. **Database**: Auto-creates/syncs users from session data
4. **Authorization**: Role-based access + resource ownership checks

## Directory Structure

```
app/
├── main.py              # FastAPI application
├── settings.py          # Configuration
├── api/                 # Dependencies
├── auth/                # Authentication & authorization
├── routers/             # API endpoints
├── agents/              # AI agent system
├── models/              # Pydantic models
├── repositories/        # Data access layer
├── utils/               # GitHub, embeddings, XML
├── core/                # Middleware, responses, logging
├── celery/              # Background tasks
└── tests/               # Test suite
```

## Docker Services

The `docker-compose.yml` includes:
- **app**: FastAPI application (port 8000)
- **celery-worker**: Background task processor
- **redis**: Cache and message broker (port 6379)
- **mongo**: MongoDB database (port 27017)

## API Endpoints

- `/api/health` - Health check
- `/api/setup/*` - Initial setup endpoints
- `/api/chat/*` - Chat functionality
- `/api/diagram/*` - Diagram generation
- `/api/user/*` - User management
- `/docs` - Interactive API documentation

## Development Notes

- Docker Compose provides all services for local development
- MongoDB and Redis data persisted in Docker volumes
- Repository cloning in `clones/` directory (volume mounted)
- All routers use type hints and consistent error handling
- Resource ownership enforced via middleware
- Logs output to `logs/` directory
- Background tasks handled by Celery workers