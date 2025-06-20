# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Production with workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Using Docker Compose (recommended for full stack)
docker-compose up --build
```

### Background Tasks
```bash
# Start Celery worker for background processing
celery -A app.celery.worker.celery_app worker --loglevel=info

# Start Redis (required for Celery)
docker run -p 6379:6379 redis
```

### Testing
```bash
# Run tests
pytest app/tests/

# Run specific test file
pytest app/tests/test_tools_router.py
```

### Dependencies
```bash
# Install dependencies
pip install -r requirements.txt

# For development with virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Architecture Overview

### Core Application Structure
- **FastAPI Application**: Main application in `app/main.py` with factory pattern
- **Settings**: Centralized configuration in `settings.py` using Pydantic
- **Agent-Based Processing**: Multi-agent system using Google ADK for AI-powered features
- **Async Task Queue**: Celery with Redis for background processing
- **Database**: MongoDB with Motor for async operations

### Key Components

#### Agent System (`app/agents/`)
The application uses a sequential agent architecture:
- **Chat Agent**: Handles conversational queries with security checking, query generation, information retrieval, and response formatting
- **Diagram Agent**: Generates Mermaid diagrams with query generation, information retrieval, diagram creation, and validation
- **Security Agent**: Validates and filters user inputs for security
- **Information Retrieval Agent**: Searches and retrieves relevant code information using vector embeddings

#### Data Layer (`app/models/`, `app/repositories/`)
- **Base Model**: Shared Pydantic models in `app/models/base.py`
- **Domain Models**: User, Chat, Message, Diagram models with MongoDB integration
- **Repository Pattern**: Abstracted data access with implementations in `app/repositories/`

#### API Layer (`app/routers/`)
- **Tools Router**: GitHub integration, repository processing, code analysis
- **Chat Router**: Conversational AI endpoints
- **Diagram Router**: Mermaid diagram generation and management
- **User Router**: User management and authentication

#### Utilities (`app/utils/`)
- **GitHub Handler**: Repository cloning, processing, and analysis
- **Embedder**: Vector embeddings for code search using sentence-transformers
- **XML Converter**: Code structure analysis and conversion

### Key Technologies
- **FastAPI**: Web framework with automatic OpenAPI documentation
- **Google ADK**: Agent Development Kit for multi-agent AI workflows
- **Celery + Redis**: Distributed task queue for background processing
- **MongoDB + Motor**: Async NoSQL database operations
- **Sentence Transformers**: Vector embeddings for semantic code search
- **Mermaid**: Diagram generation and visualization
- **LiteLLM**: Multi-provider LLM integration

### Environment Configuration
Required environment variables (see `.env` example in README):
- Database: `APPLICATION_MONGO_URI`, `APPLICATION_MONGO_DB`
- Redis: `APPLICATION_REDIS_URL`
- Security: `APPLICATION_ENCRYPTION_KEY`
- CORS: `APPLICATION_CORS_ALLOW_ORIGINS`
- Server: `APPLICATION_HOST`, `APPLICATION_PORT`, `APPLICATION_UVICORN_WORKERS_COUNT`

### Development Notes
- The application uses middleware for credential decryption (`app/core/middleware.py`)
- Logging is configured in `app/core/logging.py` with file output to `logs/`
- Repository cloning and processing happens in `clones/` directory
- Tests are located in `app/tests/` with pytest configuration
- Docker support with multi-service setup (app, Redis, MongoDB)