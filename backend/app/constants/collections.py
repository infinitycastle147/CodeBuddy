"""
MongoDB collection names constants.

This module defines all collection names used throughout the application
to avoid hardcoding and ensure consistency.
"""

# User-related collections
USERS_COLLECTION = "users"

# Chat-related collections
CHATS_COLLECTION = "chats"

# Diagram-related collections
DIAGRAMS_COLLECTION = "diagrams"

# Code analysis and embeddings collections
CODE_EMBEDDINGS_COLLECTION = "code_embeddings"

# All collections list for reference
ALL_COLLECTIONS = [
    USERS_COLLECTION,
    CHATS_COLLECTION,
    DIAGRAMS_COLLECTION,
    CODE_EMBEDDINGS_COLLECTION,
]