# Standard library imports
from typing import List, Dict, Optional
from dataclasses import dataclass

# Third-party imports
from loguru import logger

# Local application imports
from app.utils.embedder import search_similar_code_chunks
from langfuse import observe


@dataclass
class RerankResult:
    """Data class for re-ranking results"""
    user_id: str
    repo_url: str
    branch: str
    file_path: str
    chunk_index: int
    chunk: str
    original_score: float
    rerank_score: float
    final_rank: int


# Convenience function for backward compatibility
@observe(name="search_and_rerank_code_chunks")
async def search_and_rerank_code_chunks(
    query: str,
    top_k: int = 5,
    user_id: Optional[str] = None,
    repo_url: Optional[str] = None,
    enable_reranking: bool = True,
) -> List[Dict]:
    """
    Drop-in replacement for search_similar_code_chunks with optional re-ranking.
    Now uses the simplified Cohere integration directly.
    
    Args:
        query: Search query
        top_k: Number of results to return
        user_id: Optional user filter
        repo_url: Optional repository filter
        enable_reranking: Whether to apply re-ranking
        
    Returns:
        List of dictionaries with search results (maintains original format)
    """
    try:
        # Use the simplified search function with built-in reranking
        results = await search_similar_code_chunks(
            query=query, 
            top_k=top_k, 
            user_id=user_id, 
            repo_url=repo_url,
            use_reranking=enable_reranking
        )
        
        logger.info(f"Search and rerank complete. Returning {len(results)} results")
        return results
        
    except Exception as e:
        logger.error(f"Error in search_and_rerank_code_chunks: {e}")
        # Fallback to search without reranking
        logger.info("Falling back to search without reranking")
        return await search_similar_code_chunks(
            query=query, 
            top_k=top_k, 
            user_id=user_id, 
            repo_url=repo_url,
            use_reranking=False
        )