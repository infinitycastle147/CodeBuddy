#!/bin/bash

# CodeBuddy Backend Deployment Script
# This script handles production deployment with proper error handling

set -euo pipefail

# Configuration
COMPOSE_FILE="${1:-docker-compose.yml}"
PROJECT_NAME="codebuddy"
BACKUP_DIR="./backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if Docker and Docker Compose are installed
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    log "Prerequisites check passed."
}

# Check if .env file exists
check_environment() {
    log "Checking environment configuration..."
    
    if [ ! -f .env ]; then
        warn ".env file not found. Copying from .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            warn "Please edit .env file with your actual configuration values."
        else
            error ".env.example file not found. Cannot create environment configuration."
        fi
    fi
    
    log "Environment configuration check passed."
}

# Create backup of current data
backup_data() {
    log "Creating backup of current data..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup MongoDB data if container is running
    if docker-compose ps | grep -q "mongo.*Up"; then
        log "Backing up MongoDB data..."
        docker-compose exec -T mongo mongodump --archive > "$BACKUP_DIR/mongo_backup_$(date +%Y%m%d_%H%M%S).archive"
    fi
    
    # Backup application logs
    if [ -d "logs" ]; then
        log "Backing up application logs..."
        tar -czf "$BACKUP_DIR/logs_backup_$(date +%Y%m%d_%H%M%S).tar.gz" logs/
    fi
    
    log "Backup completed."
}

# Build and deploy application
deploy() {
    log "Starting deployment with $COMPOSE_FILE..."
    
    # Pull latest images
    log "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build application image
    log "Building application image..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    
    # Stop current services gracefully
    log "Stopping current services..."
    docker-compose -f "$COMPOSE_FILE" down --timeout 30
    
    # Start services
    log "Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_health
    
    log "Deployment completed successfully!"
}

# Check service health
check_health() {
    log "Checking service health..."
    
    # Check main application
    if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
        error "Application health check failed!"
    fi
    
    # Check Redis
    if ! docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        error "Redis health check failed!"
    fi
    
    # Check MongoDB
    if ! docker-compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        error "MongoDB health check failed!"
    fi
    
    log "All services are healthy."
}

# Cleanup old images and containers
cleanup() {
    log "Cleaning up old images and containers..."
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused containers
    docker container prune -f
    
    # Remove unused volumes (be careful with this)
    # docker volume prune -f
    
    log "Cleanup completed."
}

# Show usage
usage() {
    echo "Usage: $0 [docker-compose-file]"
    echo "  docker-compose-file: Path to docker-compose file (default: docker-compose.yml)"
    echo ""
    echo "Examples:"
    echo "  $0                           # Deploy with default docker-compose.yml"
    echo "  $0 docker-compose.prod.yml   # Deploy with production configuration"
}

# Main execution
main() {
    log "Starting CodeBuddy deployment process..."
    
    check_prerequisites
    check_environment
    backup_data
    deploy
    cleanup
    
    log "Deployment process completed successfully!"
    log "Application is available at: http://localhost:8000"
    log "API documentation: http://localhost:8000/docs"
}

# Handle script arguments
if [ "$#" -gt 1 ]; then
    usage
    exit 1
fi

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    usage
    exit 0
fi

# Run main function
main