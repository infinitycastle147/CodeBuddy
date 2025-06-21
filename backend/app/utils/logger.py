"""
Simple logger utility for consistent logging across the application.

Import this to get a properly configured logger anywhere in the application.
"""

from loguru import logger

# Re-export logger for convenience
__all__ = ["logger"]