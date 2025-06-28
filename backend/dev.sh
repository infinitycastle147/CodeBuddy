#!/bin/bash

# CodeBuddy Development Helper Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}CodeBuddy Development Helper${NC}"
echo "=========================="

# Optional .env setup (can remove if unused)
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Start dev containers
echo -e "${GREEN}Starting development environment...${NC}"
docker compose -f docker-compose.dev.yml up -d

echo ""
echo -e "${GREEN}Development environment is ready!${NC}"
echo ""
echo "🚀 Services available at:"
echo "  - API:          http://localhost:8000"
echo "  - API Docs:     http://localhost:8000/docs"
echo "  - MongoDB GUI:  http://localhost:8081 (admin/dev123)"
echo "  - Redis GUI:    http://localhost:8082"
echo "  - Mailhog:      http://localhost:8025"
echo ""
echo "📝 Useful commands:"
echo "  - View logs:    docker compose -f docker-compose.dev.yml logs -f app"
echo "  - Stop:         docker compose -f docker-compose.dev.yml down"
echo "  - Shell:        docker compose -f docker-compose.dev.yml exec app bash"
