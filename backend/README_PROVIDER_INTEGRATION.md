# Provider Integration for Embeddings and Reranking

This document describes the new provider system for embedding and reranking services in CodeBuddy.

## Overview

The codebase now supports pluggable providers for embeddings and reranking, allowing easy switching between different services like SentenceTransformers and Cohere.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Provider Selection
EMBEDDING_PROVIDER=cohere  # or sentence_transformers
RERANKING_PROVIDER=cohere  # or sentence_transformers

# Model Selection
EMBEDDING_MODEL=embed-english-v3.0  # for Cohere
RERANKING_MODEL=rerank-v3.5  # for Cohere

# API Keys
COHERE_API_KEY=your_cohere_api_key_here
```

### Cohere Models

**Embedding Models:**
- `embed-english-v3.0` (1024 dimensions)
- `embed-multilingual-v3.0` (1024 dimensions)  
- `embed-english-light-v3.0` (384 dimensions)
- `embed-multilingual-light-v3.0` (384 dimensions)

**Reranking Models:**
- `rerank-v3.5` (recommended)
- `rerank-v2.0`

### SentenceTransformers Models

**Embedding Models:**
- `all-MiniLM-L6-v2` (384 dimensions, default)
- `all-mpnet-base-v2` (768 dimensions)
- `all-distilroberta-v1` (768 dimensions)

**Reranking Models:**
- `cross-encoder/ms-marco-MiniLM-L6-v2` (default)
- `cross-encoder/ms-marco-distilbert-base-v3`

## Usage

### Switching Providers

To switch to Cohere:

```bash
# In your .env file
EMBEDDING_PROVIDER=cohere
RERANKING_PROVIDER=cohere
COHERE_API_KEY=your_api_key
```

To switch back to SentenceTransformers:

```bash
# In your .env file
EMBEDDING_PROVIDER=sentence_transformers
RERANKING_PROVIDER=sentence_transformers
```

### Programmatic Usage

```python
from app.utils.providers.factory import ProviderManager, ProviderType

# Create provider manager
config = {
    'embedding_provider': 'cohere',
    'reranking_provider': 'cohere',
    'embedding_config': {
        'model': 'embed-english-v3.0',
        'api_key': 'your_api_key'
    },
    'reranking_config': {
        'model': 'rerank-v3.5',
        'api_key': 'your_api_key'
    }
}

manager = ProviderManager(config)

# Get embedding provider
embedding_provider = manager.get_embedding_provider()
embeddings = embedding_provider.generate_embeddings(
    ['Hello world', 'Another text'],
    input_type=EmbeddingInputType.SEARCH_DOCUMENT
)

# Get reranking provider
reranking_provider = manager.get_reranking_provider()
results = reranking_provider.rerank(
    query='search query',
    documents=[{'text': 'doc1'}, {'text': 'doc2'}],
    top_n=5
)
```

## Provider Benefits

### Cohere
- **Higher Quality**: Better semantic understanding
- **Specialized Models**: Purpose-built for embeddings and reranking
- **Better Multilingual Support**: Supports 100+ languages
- **Optimized for Search**: Designed specifically for search applications

### SentenceTransformers
- **Local Processing**: No API calls required
- **No Cost**: Free to use
- **Offline Capability**: Works without internet
- **Full Control**: Complete control over model weights

## Migration Guide

### From Existing Code

The existing functions still work as before:

```python
# These functions automatically use the configured provider
from app.utils.embedder import generate_embedding
from app.utils.reranker import search_and_rerank_code_chunks

# Generate embedding (uses configured provider)
embedding = generate_embedding("some text")

# Search and rerank (uses configured provider)
results = await search_and_rerank_code_chunks(
    query="search query",
    top_k=5,
    enable_reranking=True
)
```

### Database Considerations

When switching providers, note that:
- Different models may have different embedding dimensions
- You may need to regenerate embeddings for optimal results
- MongoDB vector indices may need updating for dimension changes

## Performance Considerations

### Cohere
- **API Latency**: Network calls add latency
- **Rate Limits**: API rate limits apply
- **Cost**: Usage-based pricing
- **Batch Processing**: Supports up to 96 texts per embedding request

### SentenceTransformers
- **Memory Usage**: Models loaded in memory
- **CPU/GPU**: Processing happens locally
- **Startup Time**: Model loading time on first use
- **Batch Processing**: Limited by available memory

## Error Handling

The provider system includes automatic fallback:
- If Cohere API is unavailable, it falls back to original search
- Configuration errors are logged clearly
- Invalid API keys are handled gracefully

## Monitoring

All provider interactions are logged:
- Provider initialization
- API calls and responses
- Error conditions
- Performance metrics

## Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Test with SentenceTransformers
export EMBEDDING_PROVIDER=sentence_transformers
export RERANKING_PROVIDER=sentence_transformers
python -m pytest app/tests/

# Test with Cohere
export EMBEDDING_PROVIDER=cohere
export RERANKING_PROVIDER=cohere
export COHERE_API_KEY=your_api_key
python -m pytest app/tests/
```

## Architecture

```
app/utils/providers/
├── __init__.py
├── base.py                    # Abstract base classes
├── cohere_provider.py         # Cohere implementation
├── sentence_transformers_provider.py  # SentenceTransformers implementation
└── factory.py                # Provider factory and manager
```

The provider system follows the Abstract Factory pattern, making it easy to add new providers in the future.