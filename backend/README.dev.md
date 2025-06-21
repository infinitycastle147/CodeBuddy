# CodeBuddy Backend - Development Guide

Quick guide for local development setup.

## Quick Start

1. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

2. **Start development environment**
   ```bash
   ./dev.sh
   # or
   make dev
   ```

3. **Access services**
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - MongoDB GUI: http://localhost:8081
   - Redis GUI: http://localhost:8082

## Development Commands

```bash
# Start development with hot reload
make dev

# View logs
make logs

# Open shell in container
make shell

# Stop services
make stop

# Clean everything
make clean

# Run tests
make test
```

## Local Development (without Docker)

```bash
# Install dependencies
pip install -r requirements.txt

# Start Redis and MongoDB locally
# Then run:
make dev-local
```

## File Structure

```
backend/
├── app/                 # Application code
├── docker-compose.dev.yml  # Development setup
├── Dockerfile.dev       # Development container
├── Makefile            # Development commands
├── dev.sh              # Quick start script
└── .env                # Environment variables
```

## Tips

- Code changes auto-reload in development mode
- Use the GUI tools for database inspection
- Check logs with `make logs`
- Run tests with `make test`