# Standard library imports
import asyncio
from typing import Dict, Any, Optional, List
# contextmanager import removed - no longer needed

# Third-party imports
import pymongo
from pymongo import MongoClient
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
    Tries Atlas first, then falls back to local MongoDB if configured.
    
    Returns:
        MongoClient: Configured MongoDB client instance
    """
    # Check if it's a MongoDB Atlas connection (has .mongodb.net)
    is_atlas = ".mongodb.net" in settings.mongo_uri
    
    # Try primary connection (Atlas or configured URI)
    try:
        logger.info(f"Attempting to connect to MongoDB: {'Atlas' if is_atlas else 'Primary'}")
        client = _create_client_with_config(settings.mongo_uri, is_atlas)
        
        # Test the connection
        client.admin.command('ping')
        logger.info(f"✅ Successfully connected to MongoDB ({'Atlas' if is_atlas else 'Primary'})")
        return client
        
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ Primary MongoDB connection failed: {e}")
        
        # If Atlas fails, try fallback to local
        if is_atlas:
            logger.warning("🔄 Atlas connection failed, trying local fallback...")
            try:
                local_uri = "mongodb://localhost:27017"
                local_client = _create_client_with_config(local_uri, is_atlas=False)
                
                # Test local connection
                local_client.admin.command('ping')
                logger.info("✅ Successfully connected to local MongoDB fallback")
                return local_client
                
            except (ConnectionFailure, ServerSelectionTimeoutError) as local_e:
                logger.error(f"❌ Local MongoDB fallback also failed: {local_e}")
                raise local_e
        
        raise e


def _create_client_with_config(uri: str, is_atlas: bool) -> MongoClient:
    """Helper function to create MongoDB client with appropriate config"""
    
    # Base configuration
    client_config = {
        "serverSelectionTimeoutMS": CONNECTION_TIMEOUT,
        "connectTimeoutMS": CONNECTION_TIMEOUT,
        "socketTimeoutMS": CONNECTION_TIMEOUT * 2,
        "maxPoolSize": 10,
        "minPoolSize": 1,
        "maxIdleTimeMS": 60000,  # 1 minute
        "retryWrites": True,
        "retryReads": True
    }
    
    # Add SSL/TLS configuration for MongoDB Atlas
    if is_atlas:
        client_config.update({
            "tls": True,
            "tlsAllowInvalidCertificates": False,
            "tlsAllowInvalidHostnames": False,
            "directConnection": False,
            "serverSelectionTimeoutMS": 10000,  # Longer timeout for Atlas
        })
    
    return MongoClient(uri, **client_config)


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
