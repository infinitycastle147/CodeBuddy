# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Development Commands

```bash
# Development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Docker Compose (recommended)
docker-compose up --build

# Background tasks
celery_config -A app.celery_config.worker.celery_app worker --loglevel=info
docker run -p 6379:6379 redis

# Testing
pytest app/tests/

# Dependencies
pip install -r requirements.txt
```

## Architecture

**Core Stack**: FastAPI + MongoDB + Redis + Celery + Google ADK

### Key Components
- **API Layer** (`app/routers/`): Tools, Chat, Diagram, User endpoints
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
APPLICATION_MONGO_URI=mongodb://localhost:27017
APPLICATION_MONGO_DB=codebuddy

# Redis & Security
APPLICATION_REDIS_URL=redis://localhost:6379
APPLICATION_ENCRYPTION_KEY=your-key

# Server
APPLICATION_HOST=0.0.0.0
APPLICATION_PORT=8000
APPLICATION_CORS_ALLOW_ORIGINS=http://localhost:3000

# Authentication  
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000  # Use your frontend URL in production
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

## Development Notes

- MongoDB Atlas with local fallback
- Logs output to `logs/` directory
- Repository cloning in `clones/` directory
- All routers use type hints and consistent error handling
- Resource ownership enforced via middleware