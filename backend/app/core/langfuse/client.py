"""
Langfuse client configuration and initialization.

This module provides a centralized Langfuse client instance for observability and tracing
across the application.
"""

from langfuse import Langfuse, observe
from settings import settings
from loguru import logger 

# Initialize Langfuse client
langfuse_client = None

def get_langfuse_client() -> Langfuse:
    """
    Get or initialize the Langfuse client.
    
    Returns:
        Langfuse: The configured Langfuse client instance.
    """
    global langfuse_client
    
    if not settings.langfuse_enabled:
        logger.info("Langfuse is disabled")
        return None
    
    if langfuse_client is None:
        try:
            langfuse_client = Langfuse(
                secret_key=settings.langfuse_secret_key,
                public_key=settings.langfuse_public_key,
                host=settings.langfuse_host,
            )
            logger.info("Langfuse client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Langfuse client: {e}")
            return None
    
    return langfuse_client

def trace_agent_execution(name: str = None):
    """
    Decorator for tracing agent execution with Langfuse.
    
    Args:
        name: Optional name for the trace. If not provided, uses function name.
    
    Returns:
        Decorator function.
    """
    def decorator(func):
        if not settings.langfuse_enabled:
            return func
        
        return observe(name=name or func.__name__)(func)
    
    return decorator

def create_trace(name: str, user_id: str = None, session_id: str = None, **kwargs):
    """
    Create a new trace in Langfuse.
    
    Args:
        name: Name of the trace
        user_id: Optional user ID
        session_id: Optional session ID
        **kwargs: Additional trace metadata
    
    Returns:
        Langfuse trace object or None if disabled
    """
    client = get_langfuse_client()
    if not client:
        return None
    
    try:
        return client.trace(
            name=name,
            user_id=user_id,
            session_id=session_id,
            **kwargs
        )
    except Exception as e:
        logger.error(f"Failed to create trace: {e}")
        return None

def flush_langfuse():
    """
    Flush pending Langfuse events.
    """
    client = get_langfuse_client()
    if client:
        try:
            client.flush()
        except Exception as e:
            logger.error(f"Failed to flush Langfuse: {e}")