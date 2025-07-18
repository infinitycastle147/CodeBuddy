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
from app.settings import settings
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


class CodeReranker:
    """
    Re-ranking system for improving code search results using cross-encoders.
    
    This class provides a two-stage retrieval process:
    1. Initial retrieval using bi-encoder (existing vector search)
    2. Re-ranking using cross-encoder for better relevance
    """
    
    def __init__(self, model_name: str = "cross-encoder/ms-marco-MiniLM-L6-v2"):
        """
        Initialize the re-ranker with a cross-encoder model.
        
        Args:
            model_name: HuggingFace model name for cross-encoder
                       Options:
                       - "cross-encoder/ms-marco-MiniLM-L6-v2" (lightweight, good performance)
                       - "cross-encoder/ms-marco-TinyBERT-L-2-v2" (even lighter)
                       - "cross-encoder/ms-marco-distilbert-base-v3" (balanced)
        """
        self.model_name = model_name
        self._model = None
        
    def _get_model(self) -> CrossEncoder:
        """Lazy load the cross-encoder model"""
        if self._model is None:
            try:
                self._model = CrossEncoder(self.model_name)
                logger.info(f"Initialized cross-encoder model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to initialize cross-encoder model: {e}")
                raise
        return self._model
    
    @observe(name="vector_search_and_rerank")
    async def search_and_rerank(
        self,
        query: str,
        initial_k: int = 32,  # Retrieve more initially
        final_k: int = 5,     # Return fewer after re-ranking
        user_id: Optional[str] = None,
        repo_url: Optional[str] = None,
        rerank_threshold: float = -15.0  # Minimum score to include in results
    ) -> List[RerankResult]:
        """
        Perform two-stage retrieval: initial search + cross-encoder re-ranking.
        
        Args:
            query: User query string
            initial_k: Number of candidates to retrieve initially (should be > final_k)
            final_k: Number of results to return after re-ranking
            user_id: Optional user filter
            repo_url: Optional repository filter
            rerank_threshold: Minimum re-ranking score to include results
            
        Returns:
            List of RerankResult objects sorted by re-ranking score
        """
        if not query or not query.strip():
            logger.warning("Empty query provided for search and rerank")
            return []
            
        if initial_k < final_k:
            logger.warning(f"initial_k ({initial_k}) should be >= final_k ({final_k})")
            initial_k = max(initial_k, final_k * 2)
        
        try:
            # Step 1: Initial retrieval using existing bi-encoder
            logger.info(f"Retrieving top {initial_k} candidates for query: '{query}'")
            initial_results = await search_similar_code_chunks(
                query=query,
                top_k=initial_k,
                user_id=user_id,
                repo_url=repo_url
            )
            
            if not initial_results:
                logger.info("No initial results found")
                return []
            
            logger.info(f"Retrieved {len(initial_results)} candidates for re-ranking")
            
            # Step 2: Prepare query-document pairs for cross-encoder
            model = self._get_model()
            
            # Create pairs for cross-encoder scoring
            query_doc_pairs = []
            for result in initial_results:
                # Combine file path and chunk for better context
                doc_text = f"File: {result['file_path']}\n\n{result['chunk']}"
                query_doc_pairs.append([query, doc_text])
            
            # Step 3: Get re-ranking scores
            logger.info("Computing cross-encoder scores...")
            rerank_scores = model.predict(query_doc_pairs)
            
            # Step 4: Combine original results with re-ranking scores
            reranked_results = []
            for i, (result, rerank_score) in enumerate(zip(initial_results, rerank_scores)):
                if rerank_score >= rerank_threshold:
                    rerank_result = RerankResult(
                        user_id=result['user_id'],
                        repo_url=result['repo_url'],
                        branch=result['branch'],
                        file_path=result['file_path'],
                        chunk_index=result['chunk_index'],
                        chunk=result['chunk'],
                        original_score=result.get('score', 0.0),
                        rerank_score=float(rerank_score),
                        final_rank=0  # Will be set after sorting
                    )
                    reranked_results.append(rerank_result)
            
            # Step 5: Sort by re-ranking score and assign final ranks
            reranked_results.sort(key=lambda x: x.rerank_score, reverse=True)
            for rank, result in enumerate(reranked_results[:final_k], 1):
                result.final_rank = rank
            
            final_results = reranked_results[:final_k]
            
            logger.info(f"Re-ranking complete. Returning top {len(final_results)} results")
            
            # Log score improvements for debugging
            if final_results:
                for i, result in enumerate(final_results[:3]):  # Log top 3
                    logger.debug(
                        f"Rank {i+1}: Original={result.original_score:.4f}, "
                        f"Rerank={result.rerank_score:.4f}, File={result.file_path}"
                    )
            
            return final_results
            
        except Exception as e:
            logger.error(f"Error in search and rerank: {e}")
            # Fallback to original search results
            logger.info("Falling back to original search results")
            fallback_results = await search_similar_code_chunks(
                query=query, top_k=final_k, user_id=user_id, repo_url=repo_url
            )
            
            # Convert to RerankResult format
            return [
                RerankResult(
                    user_id=result['user_id'],
                    repo_url=result['repo_url'],
                    branch=result['branch'],
                    file_path=result['file_path'],
                    chunk_index=result['chunk_index'],
                    chunk=result['chunk'],
                    original_score=result.get('score', 0.0),
                    rerank_score=result.get('score', 0.0),  # Use original score as fallback
                    final_rank=i+1
                )
                for i, result in enumerate(fallback_results)
            ]
    
    def batch_rerank(
        self,
        query: str,
        documents: List[str],
        batch_size: int = 32
    ) -> List[Tuple[str, float]]:
        """
        Re-rank a batch of documents for a single query.
        Useful for custom implementations.
        
        Args:
            query: Search query
            documents: List of document texts to rank
            batch_size: Process documents in batches to manage memory
            
        Returns:
            List of (document, score) tuples sorted by score (descending)
        """
        try:
            model = self._get_model()
            
            all_results = []
            for i in range(0, len(documents), batch_size):
                batch_docs = documents[i:i + batch_size]
                batch_pairs = [[query, doc] for doc in batch_docs]
                
                batch_scores = model.predict(batch_pairs)
                batch_results = list(zip(batch_docs, batch_scores))
                all_results.extend(batch_results)
            
            # Sort by score (descending)
            all_results.sort(key=lambda x: x[1], reverse=True)
            return all_results
            
        except Exception as e:
            logger.error(f"Error in batch rerank: {e}")
            # Return documents with zero scores as fallback
            return [(doc, 0.0) for doc in documents]


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
                    'model': getattr(settings, 'RERANKING_MODEL', 'cross-encoder/ms-marco-MiniLM-L6-v2'),
                    'max_documents': 1000,
                    'api_key': os.getenv('COHERE_API_KEY')
                }
            }
            
            _provider_manager = ProviderManager(provider_config)
        except Exception as e:
            logger.error(f"Failed to initialize provider manager: {e}")
            raise
    return _provider_manager


# Singleton instance for reuse across the application
_reranker_instance = None

def get_reranker(model_name: str = "cross-encoder/ms-marco-MiniLM-L6-v2") -> CodeReranker:
    """
    Get a singleton instance of CodeReranker.
    
    Args:
        model_name: Cross-encoder model name
        
    Returns:
        CodeReranker instance
    """
    global _reranker_instance
    if _reranker_instance is None or _reranker_instance.model_name != model_name:
        _reranker_instance = CodeReranker(model_name=model_name)
    return _reranker_instance


# Convenience function for backward compatibility
async def search_and_rerank_code_chunks(
    query: str,
    top_k: int = 5,
    user_id: Optional[str] = None,
    repo_url: Optional[str] = None,
    enable_reranking: bool = True,
    rerank_model: str = "cross-encoder/ms-marco-MiniLM-L6-v2"
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
        rerank_model: Cross-encoder model to use
        
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
        
        # Convert back to original format for compatibility
        final_results = []
        for rank, rerank_result in enumerate(reranked_results, 1):
            # Get original metadata
            original_metadata = documents[rerank_result.index]['metadata']
            
            result_dict = {
                'user_id': original_metadata['user_id'],
                'repo_url': original_metadata['repo_url'],
                'branch': original_metadata['branch'],
                'file_path': original_metadata['file_path'],
                'chunk_index': original_metadata['chunk_index'],
                'chunk': original_metadata['chunk'],
                'score': rerank_result.relevance_score,
                'original_score': original_metadata.get('score', 0.0),
                'rank': rank
            }
            final_results.append(result_dict)
        
        return final_results
        
    except Exception as e:
        logger.error(f"Error in provider-based reranking: {e}")
        # Fallback to original search or legacy reranker
        logger.info("Falling back to legacy reranker")
        reranker = get_reranker(rerank_model)
        results = await reranker.search_and_rerank(
            query=query,
            initial_k=min(32, top_k * 4),
            final_k=top_k,
            user_id=user_id,
            repo_url=repo_url
        )
        
        # Convert back to original format for compatibility
        return [
            {
                'user_id': result.user_id,
                'repo_url': result.repo_url,
                'branch': result.branch,
                'file_path': result.file_path,
                'chunk_index': result.chunk_index,
                'chunk': result.chunk,
                'score': result.rerank_score,
                'original_score': result.original_score,
                'rank': result.final_rank
            }
            for result in results
        ]