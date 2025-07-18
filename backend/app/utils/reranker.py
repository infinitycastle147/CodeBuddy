# Standard library imports
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass

# Third-party imports
from loguru import logger

# Local application imports
from app.utils.embedder import search_similar_code_chunks
from langfuse import observe
from app.utils.providers.factory import ProviderManager
from app.utils.providers.base import RerankResult as BaseRerankResult
from settings import settings
import os


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


# Provider manager for reranking
_provider_manager = None

def get_provider_manager():
    """
    Get or initialize the provider manager for reranking.
    
    Returns:
        ProviderManager: The initialized provider manager.
    """
    global _provider_manager
    if _provider_manager is None:
        try:
            # Get provider configuration from settings
            provider_config = {
                'embedding_provider': getattr(settings, 'EMBEDDING_PROVIDER', 'cohere'),
                'reranking_provider': getattr(settings, 'RERANKING_PROVIDER', 'cohere'),
                'embedding_config': {
                    'model': getattr(settings, 'EMBEDDING_MODEL', 'all-MiniLM-L6-v2'),
                    'max_tokens': 512,
                    'api_key': os.getenv('COHERE_API_KEY')
                },
                'reranking_config': {
                    'model': getattr(settings, 'RERANKING_MODEL', 'rerank-v3.5'),
                    'max_tokens': 512,
                    'api_key': os.getenv('COHERE_API_KEY')
                }
            }
            
            _provider_manager = ProviderManager(provider_config)
            logger.info("Provider manager initialized for reranking")
            
        except Exception as e:
            logger.error(f"Failed to initialize provider manager: {e}")
            raise
    
    return _provider_manager


# Convenience function for backward compatibility
@observe(name="search_and_rerank_code_chunks")
async def search_and_rerank_code_chunks(
    query: str,
    top_k: int = 5,
    user_id: Optional[str] = None,
    repo_url: Optional[str] = None,
    enable_reranking: bool = True,
    rerank_model: str = "rerank-v3.5"
) -> List[Dict]:
    """
    Drop-in replacement for search_similar_code_chunks with optional re-ranking.
    Uses the new provider system for better flexibility.
    
    Args:
        query: Search query
        top_k: Number of results to return
        user_id: Optional user filter
        repo_url: Optional repository filter
        enable_reranking: Whether to apply re-ranking
        rerank_model: Reranking model to use
        
    Returns:
        List of dictionaries with search results (maintains original format)
    """
    if not enable_reranking:
        # Use original function if re-ranking is disabled
        return await search_similar_code_chunks(
            query=query, top_k=top_k, user_id=user_id, repo_url=repo_url
        )
    
    try:
        # Get initial results
        initial_k = min(32, top_k * 4)  # Retrieve 4x more for re-ranking
        initial_results = await search_similar_code_chunks(
            query=query, top_k=initial_k, user_id=user_id, repo_url=repo_url
        )
        
        if not initial_results:
            return []
        
        # Use provider-based reranking
        provider_manager = get_provider_manager()
        reranking_provider = provider_manager.get_reranking_provider()
        
        # Prepare documents for reranking
        documents = []
        for result in initial_results:
            doc_dict = {
                'text': f"File: {result['file_path']}\n\n{result['chunk']}",
                'metadata': result
            }
            documents.append(doc_dict)
        
        # Perform reranking
        reranked_results = reranking_provider.rerank(
            query=query,
            documents=documents,
            top_n=top_k
        )
        
        # Convert back to original format
        final_results = []
        for rerank_result in reranked_results:
            original_result = rerank_result.metadata
            result_dict = {
                'user_id': original_result['user_id'],
                'repo_url': original_result['repo_url'],
                'branch': original_result['branch'],
                'file_path': original_result['file_path'],
                'chunk_index': original_result['chunk_index'],
                'chunk': original_result['chunk'],
                'score': rerank_result.relevance_score,  # Use rerank score
                'rerank_score': rerank_result.relevance_score,
                'original_score': original_result.get('score', 0.0)
            }
            final_results.append(result_dict)
        
        logger.info(f"Reranking complete. Returning {len(final_results)} results")
        return final_results
        
    except Exception as e:
        logger.error(f"Error in search_and_rerank_code_chunks: {e}")
        # Fallback to original search without reranking
        logger.info("Falling back to original search results")
        return await search_similar_code_chunks(
            query=query, top_k=top_k, user_id=user_id, repo_url=repo_url
        )