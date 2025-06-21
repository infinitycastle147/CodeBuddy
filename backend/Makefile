# CodeBuddy Backend - Development Makefile
.PHONY: help dev prod stop clean logs test install

# Default target
help:
	@echo "CodeBuddy Backend Development Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development environment with hot reload"
	@echo "  make prod       - Start production environment"
	@echo "  make stop       - Stop all services"
	@echo "  make logs       - Show application logs"
	@echo "  make shell      - Open shell in running app container"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make install    - Install dependencies locally"
	@echo "  make test       - Run tests"
	@echo ""

# Development environment
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Services available at:"
	@echo "  - API: http://localhost:8000"
	@echo "  - Docs: http://localhost:8000/docs"
	@echo "  - MongoDB GUI: http://localhost:8081"
	@echo "  - Redis GUI: http://localhost:8082"

# Production environment
prod:
	@echo "Starting production environment..."
	docker-compose up -d

# Stop services
stop:
	@echo "Stopping all services..."
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# Show logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f app

# Open shell in app container
shell:
	docker-compose -f docker-compose.dev.yml exec app bash

# Clean up
clean:
	@echo "Cleaning up containers and images..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	docker system prune -f

# Install dependencies locally
install:
	pip install -r requirements.txt

# Run tests
test:
	pytest app/tests/ -v

# Quick development server (without Docker)
dev-local:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload