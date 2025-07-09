# CodeBuddy Frontend - Development Makefile
.PHONY: help dev prod stop clean logs test install build shell

# Default target
help:
	@echo "CodeBuddy Frontend Development Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start development environment with hot reload"
	@echo "  make prod       - Start production environment"
	@echo "  make stop       - Stop all services"
	@echo "  make logs       - Show application logs"
	@echo "  make shell      - Open shell in running container"
	@echo ""
	@echo "Local Development:"
	@echo "  make dev-local  - Start development server without Docker"
	@echo "  make install    - Install dependencies locally"
	@echo "  make build      - Build production application"
	@echo "  make test       - Run tests (lint + type check)"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean      - Clean up containers and volumes"
	@echo "  make restart    - Restart services"
	@echo ""

# Development environment
dev:
	@echo "Starting frontend development environment..."
	@echo "Make sure backend is running first!"
	docker-compose -f docker-compose.dev.yml up -d --build
	@echo "Services available at:"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - NextAuth: http://localhost:3000/api/auth"

# Production environment
prod:
	@echo "Starting frontend production environment..."
	docker-compose up -d --build
	@echo "Production frontend available at: http://localhost:3000"

# Stop services
stop:
	@echo "Stopping frontend services..."
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

# Restart services
restart: stop dev

# Show logs
logs:
	docker-compose -f docker-compose.dev.yml logs -f frontend

# Open shell in container
shell:
	docker-compose -f docker-compose.dev.yml exec frontend sh

# Clean up
clean:
	@echo "Cleaning up frontend containers and volumes..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose down -v
	docker system prune -f

# Install dependencies locally
install:
	@echo "Installing frontend dependencies..."
	npm ci

# Build production application
build:
	@echo "Building production application..."
	npm run build

# Run tests (lint + type check)
test:
	@echo "Running frontend tests..."
	npm run lint
	npx tsc --noEmit

# Local development server (without Docker)
dev-local:
	@echo "Starting local development server..."
	npm run dev

# Full stack development (starts both backend and frontend)
dev-full:
	@echo "Starting full stack development environment..."
	@echo "Starting backend first..."
	cd ../backend && make dev
	@echo "Waiting for backend to be ready..."
	sleep 10
	@echo "Starting frontend..."
	$(MAKE) dev