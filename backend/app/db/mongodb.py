# Standard library imports
import asyncio
from typing import Tuple, Dict, Any, Optional, List
from contextlib import contextmanager

# Third-party imports
import pymongo
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from loguru import logger

# Application imports
from settings import settings

# Constants
CONNECTION_TIMEOUT = 5000  # milliseconds


def create_mongo_client() -> MongoClient:
    """
    Create a new MongoDB client with proper configuration.
    
    Returns:
        MongoClient: Configured MongoDB client instance
    """
    try:
        # Configure client with proper timeouts and connection pooling
        client = MongoClient(
            settings.mongo_uri,
            serverSelectionTimeoutMS=CONNECTION_TIMEOUT,
            connectTimeoutMS=CONNECTION_TIMEOUT,
            socketTimeoutMS=CONNECTION_TIMEOUT * 2,
            maxPoolSize=10,
            minPoolSize=1,
            maxIdleTimeMS=60000,  # 1 minute
            retryWrites=True,
            retryReads=True
        )
        
        # Test the connection
        client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB at: {settings.mongo_uri}")
        return client
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


# Singleton client for application-wide use
_mongo_client = None


def get_mongo_client() -> MongoClient:
    """
    Get or create a MongoDB client singleton.
    
    Returns:
        MongoClient: MongoDB client instance
    """
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = create_mongo_client()
    return _mongo_client


@contextmanager
def get_mongo_connection() -> Tuple[MongoClient, Database, Collection]:
    """
    Get a MongoDB connection with proper error handling and cleanup.
    This is a context manager for synchronous code.
    
    Yields:
        Tuple[MongoClient, Database, Collection]: MongoDB client, database, and collection
    """
    client = None
    try:
        client = get_mongo_client()
        db = client[settings.mongo_db]
        collection = db[settings.mongo_collection]
        yield client, db, collection
    except Exception as e:
        logger.error(f"MongoDB operation failed: {e}")
        raise
    finally:
        # We don't close the client here as it's a singleton
        # The connection will be returned to the pool
        pass


def get_db_and_collection(client: MongoClient = None) -> Tuple[Database, Collection]:
    """
    Get database and collection objects from a client.
    
    Args:
        client (MongoClient, optional): MongoDB client. If None, uses the singleton.
    
    Returns:
        Tuple[Database, Collection]: MongoDB database and collection
    """
    if client is None:
        client = get_mongo_client()
    db = client[settings.mongo_db]
    collection = db[settings.mongo_collection]
    return db, collection


# Async support using event loop executors
async def async_mongo_operation(operation, *args, **kwargs):
    """
    Execute a MongoDB operation asynchronously using the event loop's executor.
    
    Args:
        operation: The MongoDB operation function to execute
        *args: Arguments to pass to the operation
        **kwargs: Keyword arguments to pass to the operation
    
    Returns:
        Any: The result of the MongoDB operation
    """
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, lambda: operation(*args, **kwargs)
    )


async def async_find_one(collection: Collection, query: Dict[str, Any], *args, **kwargs) -> Optional[Dict[str, Any]]:
    """
    Asynchronously execute a find_one operation.
    
    Args:
        collection (Collection): MongoDB collection
        query (Dict[str, Any]): Query filter
        *args: Additional arguments for find_one
        **kwargs: Additional keyword arguments for find_one
    
    Returns:
        Optional[Dict[str, Any]]: Found document or None
    """
    return await async_mongo_operation(collection.find_one, query, *args, **kwargs)


async def async_find(collection: Collection, query: Dict[str, Any], *args, **kwargs) -> List[Dict[str, Any]]:
    """
    Asynchronously execute a find operation and return results as a list.
    
    Args:
        collection (Collection): MongoDB collection
        query (Dict[str, Any]): Query filter
        *args: Additional arguments for find
        **kwargs: Additional keyword arguments for find
    
    Returns:
        List[Dict[str, Any]]: List of found documents
    """
    cursor = collection.find(query, *args, **kwargs)
    return await async_mongo_operation(list, cursor)


async def async_insert_one(collection: Collection, document: Dict[str, Any], *args, **kwargs) -> pymongo.results.InsertOneResult:
    """
    Asynchronously execute an insert_one operation.
    
    Args:
        collection (Collection): MongoDB collection
        document (Dict[str, Any]): Document to insert
        *args: Additional arguments for insert_one
        **kwargs: Additional keyword arguments for insert_one
    
    Returns:
        pymongo.results.InsertOneResult: Insert result
    """
    return await async_mongo_operation(collection.insert_one, document, *args, **kwargs)


async def async_update_one(collection: Collection, filter: Dict[str, Any], update: Dict[str, Any], *args, **kwargs) -> pymongo.results.UpdateResult:
    """
    Asynchronously execute an update_one operation.
    
    Args:
        collection (Collection): MongoDB collection
        filter (Dict[str, Any]): Query filter
        update (Dict[str, Any]): Update operations
        *args: Additional arguments for update_one
        **kwargs: Additional keyword arguments for update_one
    
    Returns:
        pymongo.results.UpdateResult: Update result
    """
    return await async_mongo_operation(collection.update_one, filter, update, *args, **kwargs)


async def async_delete_one(collection: Collection, filter: Dict[str, Any], *args, **kwargs) -> pymongo.results.DeleteResult:
    """
    Asynchronously execute a delete_one operation.
    
    Args:
        collection (Collection): MongoDB collection
        filter (Dict[str, Any]): Query filter
        *args: Additional arguments for delete_one
        **kwargs: Additional keyword arguments for delete_one
    
    Returns:
        pymongo.results.DeleteResult: Delete result
    """
    return await async_mongo_operation(collection.delete_one, filter, *args, **kwargs)


async def async_aggregate(collection: Collection, pipeline: List[Dict[str, Any]], *args, **kwargs) -> List[Dict[str, Any]]:
    """
    Asynchronously execute an aggregate operation and return results as a list.
    
    Args:
        collection (Collection): MongoDB collection
        pipeline (List[Dict[str, Any]]): Aggregation pipeline
        *args: Additional arguments for aggregate
        **kwargs: Additional keyword arguments for aggregate
    
    Returns:
        List[Dict[str, Any]]: List of aggregation results
    """
    cursor = collection.aggregate(pipeline, *args, **kwargs)
    return await async_mongo_operation(list, cursor)


# Convenience function for getting async-compatible connection
async def get_async_mongo_connection() -> Tuple[MongoClient, Database, Collection]:
    """
    Get MongoDB connection for async operations.
    This doesn't actually create an async connection, but returns objects
    that can be used with the async helper functions.
    
    Returns:
        Tuple[MongoClient, Database, Collection]: MongoDB client, database, and collection
    """
    client = get_mongo_client()
    db = client[settings.mongo_db]
    collection = db[settings.mongo_collection]
    return client, db, collection