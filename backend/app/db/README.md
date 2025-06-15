# MongoDB Connection Module

This module provides standardized MongoDB connection handling for both synchronous and asynchronous code in the CodeBuddy application.

## Features

- Singleton MongoDB client for efficient connection pooling
- Context manager for safe connection handling
- Async support using event loop executors
- Proper error handling and reconnection logic
- Consistent interface for both sync and async code

## Usage Examples

### Synchronous Usage

```python
from app.db.mongodb import get_mongo_connection

# Using the context manager (recommended)
with get_mongo_connection() as (client, db, collection):
    # Perform MongoDB operations
    result = collection.find_one({"key": "value"})
    # No need to close the connection - handled by context manager
```

### Asynchronous Usage

```python
from app.db.mongodb import get_async_mongo_connection, async_find_one

# Get connection objects
client, db, collection = await get_async_mongo_connection()

# Use async helper functions
document = await async_find_one(collection, {"key": "value"})
```

### In FastAPI Dependency Injection

```python
from fastapi import Depends
from app.db.mongodb import get_mongo_client

async def get_mongo_db():
    client = get_mongo_client()
    try:
        yield client
    finally:
        # Connection returned to pool, not closed
        pass

@app.get("/items/{item_id}")
async def read_item(item_id: str, db = Depends(get_mongo_db)):
    # Use the database
    pass
```

### In Celery Tasks

```python
from app.db.mongodb import get_mongo_connection
from app.celery_app import celery_app

@celery_app.task
def process_data(data_id):
    with get_mongo_connection() as (client, db, collection):
        # Process data using synchronous MongoDB operations
        result = collection.find_one({"_id": data_id})
        # Do something with result
```

## Implementation Details

This module uses the official `pymongo` driver for MongoDB and provides:

1. A singleton client pattern to avoid creating multiple connections
2. Connection pooling configuration for optimal performance
3. Proper timeout and retry settings
4. Async support by running pymongo operations in the event loop's executor

The module handles both synchronous code (like Celery tasks) and asynchronous code (like FastAPI endpoints) with a consistent interface, making it easier to maintain and extend the application.