# CodeBuddy Backend - Production Deployment Guide

This guide covers deploying CodeBuddy Backend in a production environment using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM
- 20GB available disk space

## Quick Start

1. **Clone and navigate to the backend directory**
   ```bash
   cd /path/to/CodeBuddy/backend
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   nano .env
   ```

3. **Deploy using the deployment script**
   ```bash
   ./deploy.sh
   ```

## Manual Deployment

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Key environment variables to configure:

```env
# Security
APPLICATION_ENCRYPTION_KEY=your-32-byte-base64-encoded-key
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# External Services
LANGFUSE_SECRET_KEY=your-langfuse-secret-key
LANGFUSE_PUBLIC_KEY=your-langfuse-public-key

# Production Settings
APPLICATION_ENVIRONMENT=production
APPLICATION_UVICORN_WORKERS_COUNT=4
```

### 2. SSL/TLS Configuration (Optional)

For HTTPS support, create SSL certificates and update `nginx.conf`:

```bash
mkdir ssl
# Place your SSL certificates in the ssl/ directory
# cert.pem and key.pem
```

### 3. Deploy Services

#### Basic Deployment
```bash
docker-compose up -d
```

#### Production Deployment with Nginx
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verify Deployment

Check service health:
```bash
# Application health
curl http://localhost:8000/health

# Service status
docker-compose ps

# View logs
docker-compose logs -f app
```

## Monitoring Setup

Deploy the monitoring stack:

```bash
# Start monitoring services
docker-compose -f monitoring.yml up -d

# Access dashboards
# Grafana: http://localhost:3001 (admin/admin123)
# Prometheus: http://localhost:9090
```

## Backup and Recovery

### Automated Backup

The deployment script automatically creates backups in the `./backups` directory.

### Manual Backup

```bash
# Backup MongoDB
docker-compose exec mongo mongodump --archive > backup_$(date +%Y%m%d).archive

# Backup application logs
tar -czf logs_backup_$(date +%Y%m%d).tar.gz logs/
```

### Restore from Backup

```bash
# Restore MongoDB
docker-compose exec -T mongo mongorestore --archive < backup_20240101.archive
```

## Scaling

### Horizontal Scaling

Scale specific services:

```bash
# Scale application instances
docker-compose up -d --scale app=3

# Scale Celery workers
docker-compose up -d --scale celery-worker=2
```

### Load Balancing

The production setup includes Nginx for load balancing. Configure additional upstream servers in `nginx.conf`:

```nginx
upstream codebuddy_backend {
    server app:8000;
    server app2:8000;
    server app3:8000;
}
```

## Security Considerations

### Network Security

- All services run in isolated Docker networks
- Only necessary ports are exposed
- Nginx provides reverse proxy with rate limiting

### Data Security

- MongoDB runs with authentication enabled
- Application uses encryption for sensitive data
- SSL/TLS encryption for client communication

### Access Control

- Non-root users in containers
- Read-only filesystems where possible
- Resource limits for all containers

## Troubleshooting

### Common Issues

1. **Services not starting**
   ```bash
   # Check logs
   docker-compose logs app
   
   # Check resource usage
   docker stats
   ```

2. **Database connection issues**
   ```bash
   # Check MongoDB health
   docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
   
   # Check network connectivity
   docker-compose exec app ping mongo
   ```

3. **Memory issues**
   ```bash
   # Check memory usage
   docker stats --no-stream
   
   # Adjust memory limits in docker-compose.yml
   ```

### Log Analysis

Application logs are stored in:
- Container logs: `docker-compose logs -f app`
- Application files: `./logs/` directory
- System logs: `/var/log/docker/`

### Health Checks

All services include health checks:
- Application: `http://localhost:8000/health`
- Redis: `redis-cli ping`
- MongoDB: `mongosh --eval "db.adminCommand('ping')"`

## Performance Optimization

### Database Optimization

- MongoDB indexes are automatically created
- Connection pooling is configured
- Query optimization through application code

### Application Optimization

- Multi-worker Uvicorn setup
- Async request handling
- Connection pooling for external services

### Resource Optimization

- Multi-stage Docker builds
- Optimized base images
- Resource limits and reservations

## Maintenance

### Regular Tasks

1. **Update containers**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

2. **Clean up unused resources**
   ```bash
   docker system prune -f
   ```

3. **Monitor disk usage**
   ```bash
   df -h
   docker system df
   ```

### Backup Schedule

Set up automated backups using cron:

```bash
# Add to crontab
0 2 * * * /path/to/CodeBuddy/backend/deploy.sh backup
```

## Support

For issues and questions:
- Check the application logs
- Review the monitoring dashboards
- Consult the main project documentation
- Open an issue in the project repository