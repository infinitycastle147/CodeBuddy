# Cohere-Only Deployment Guide

This guide explains how to deploy CodeBuddy using only Cohere for embeddings and reranking, eliminating the need for SentenceTransformers and its heavy dependencies.

## Storage Savings

By removing SentenceTransformers dependencies, you save approximately:
- **torch**: ~750MB
- **transformers**: ~200MB  
- **sentence-transformers**: ~100MB
- **Model weights**: ~400MB (downloaded at runtime)

**Total savings: ~1.5GB**

## Quick Setup

### 1. Dependencies

The system now defaults to Cohere and will work without SentenceTransformers installed:

```bash
pip install -r requirements.txt
```

### 2. Environment Configuration

Set these environment variables:

```bash
# Required
COHERE_API_KEY=your_cohere_api_key_here

# Optional (these are now the defaults)
EMBEDDING_PROVIDER=cohere
RERANKING_PROVIDER=cohere
EMBEDDING_MODEL=embed-english-v3.0
RERANKING_MODEL=rerank-v3.5
```

### 3. That's it!

The system will automatically use Cohere for all embedding and reranking operations.

## Verification

You can verify the system is working with Cohere only by checking the logs:

```bash
# Start the application
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Look for these log messages:
# INFO: Initialized Cohere embedding provider with model: embed-english-v3.0
# INFO: Initialized Cohere reranking provider with model: rerank-v3.5
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Set environment variables
ENV EMBEDDING_PROVIDER=cohere
ENV RERANKING_PROVIDER=cohere
ENV EMBEDDING_MODEL=embed-english-v3.0
ENV RERANKING_MODEL=rerank-v3.5

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  codebuddy:
    build: .
    ports:
      - "8000:8000"
    environment:
      - COHERE_API_KEY=${COHERE_API_KEY}
      - EMBEDDING_PROVIDER=cohere
      - RERANKING_PROVIDER=cohere
      - APPLICATION_MONGO_URI=mongodb://mongo:27017
      - APPLICATION_REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

## API Costs

Cohere pricing (as of 2024):
- **Embeddings**: $0.10 per 1M tokens
- **Reranking**: $1.00 per 1M tokens

For typical code search usage:
- ~1000 code chunks = ~$0.001 for embeddings
- ~100 rerank operations = ~$0.001 for reranking

## Performance Characteristics

### Cohere Advantages:
- **Better Quality**: Superior semantic understanding
- **No Storage**: No model weights to store
- **No Memory**: No models loaded in RAM
- **Faster Startup**: No model loading time
- **Always Updated**: Latest model versions

### Considerations:
- **Network Latency**: API calls add ~100-200ms
- **Rate Limits**: 1000 requests/minute for embeddings
- **Internet Dependency**: Requires internet connection

## Monitoring

The system includes comprehensive logging:

```python
# Example log output
INFO: Initialized provider manager with embedding: cohere, reranking: cohere
INFO: Created embedding provider: cohere
INFO: Created reranking provider: cohere
INFO: Generated embeddings for 10 texts using model: embed-english-v3.0
INFO: Reranked 20 documents using model: rerank-v3.5
```

## Error Handling

If you try to use SentenceTransformers without installing it:

```python
# This will raise a helpful error:
ImportError: SentenceTransformers provider not available. 
Please install with: pip install sentence-transformers torch transformers 
or use one of the available providers: ['cohere']
```

## Migration from SentenceTransformers

### If you had embeddings stored with SentenceTransformers:

1. **Different dimensions**: Cohere embed-english-v3.0 uses 1024 dimensions vs 384 for all-MiniLM-L6-v2
2. **Re-embedding recommended**: For best results, re-process your repositories
3. **Vector index update**: Update MongoDB vector index for new dimensions

### Re-processing repositories:

```bash
# Clear existing embeddings (optional)
mongo codebuddy --eval "db.codebuddy.deleteMany({})"

# Re-process repositories via API
curl -X POST "http://localhost:8000/tools/setup" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your_user_id",
    "repo_url": "https://github.com/your/repo",
    "access_token": "your_github_token"
  }'
```

## Troubleshooting

### Common Issues:

1. **Missing API Key**:
   ```
   Error: Cohere API key is required
   ```
   Solution: Set `COHERE_API_KEY` environment variable

2. **Network Issues**:
   ```
   Error: Connection failed to Cohere API
   ```
   Solution: Check internet connectivity and firewall settings

3. **Rate Limits**:
   ```
   Error: Rate limit exceeded
   ```
   Solution: Implement exponential backoff (already included)

### Health Check

```bash
# Check if Cohere is working
curl -X GET "http://localhost:8000/health"

# Check available providers
curl -X GET "http://localhost:8000/providers/available"
```

## Production Deployment

### Environment Variables for Production:

```bash
# Core settings
COHERE_API_KEY=your_production_api_key
EMBEDDING_PROVIDER=cohere
RERANKING_PROVIDER=cohere

# Performance settings
APPLICATION_UVICORN_WORKERS_COUNT=4
APPLICATION_ENVIRONMENT=production

# Database settings
APPLICATION_MONGO_URI=mongodb://your-mongo-cluster
APPLICATION_REDIS_URL=redis://your-redis-cluster
```

### Kubernetes Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: codebuddy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: codebuddy
  template:
    metadata:
      labels:
        app: codebuddy
    spec:
      containers:
      - name: codebuddy
        image: codebuddy:latest
        ports:
        - containerPort: 8000
        env:
        - name: COHERE_API_KEY
          valueFrom:
            secretKeyRef:
              name: cohere-secret
              key: api-key
        - name: EMBEDDING_PROVIDER
          value: "cohere"
        - name: RERANKING_PROVIDER
          value: "cohere"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

This deployment approach significantly reduces resource requirements while improving search quality through Cohere's advanced models.