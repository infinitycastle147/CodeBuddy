"""
Unified logging configuration using loguru.

This module provides a simple, standardized logging setup for the entire application.
"""

import sys
from loguru import logger
from pathlib import Path

def setup_logging(log_level: str = "INFO"):
    """
    Configure loguru for the entire application.
    
    Args:
        log_level: The logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    # Remove default handler
    logger.remove()
    
    # Add console handler with format
    logger.add(
        sys.stderr,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=log_level,
        colorize=True
    )
    
    # Ensure logs directory exists
    Path("logs").mkdir(exist_ok=True)
    
    # Add file handler
    logger.add(
        "logs/app.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=log_level,
        rotation="10 MB",
        retention="1 week",
        compression="gz"
    )
    
    # Add error file handler
    logger.add(
        "logs/error.log", 
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level="ERROR",
        rotation="10 MB", 
        retention="1 month",
        compression="gz"
    )
    
    logger.info("Logging configured successfully")

# Configure logging when module is imported
setup_logging()