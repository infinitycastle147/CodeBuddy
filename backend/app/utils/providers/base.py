"""
Base abstract classes for embedding and reranking providers.
This module defines the interface that all embedding and reranking providers must implement.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum


class EmbeddingInputType(Enum):
    """Types of input for embedding generation."""
    SEARCH_DOCUMENT = "search_document"
    SEARCH_QUERY = "search_query"
    CLASSIFICATION = "classification"
    CLUSTERING = "clustering"


@dataclass
class EmbeddingResult:
    """Result of embedding generation."""
    embeddings: List[List[float]]
    model_name: str
    dimensions: int
    input_type: EmbeddingInputType
    
    
@dataclass
class RerankResult:
    """Result of reranking operation."""
    index: int
    text: str
    relevance_score: float
    original_score: Optional[float] = None


class BaseEmbeddingProvider(ABC):
    """Abstract base class for embedding providers."""
    
    @abstractmethod
    def __init__(self, config: Dict[str, Any]):
        """Initialize the embedding provider with configuration."""
        pass
    
    @abstractmethod
    def generate_embeddings(
        self, 
        texts: List[str], 
        input_type: EmbeddingInputType = EmbeddingInputType.SEARCH_DOCUMENT
    ) -> EmbeddingResult:
        """
        Generate embeddings for a list of texts.
        
        Args:
            texts: List of texts to embed
            input_type: Type of input (search_document, search_query, etc.)
            
        Returns:
            EmbeddingResult containing the embeddings and metadata
        """
        pass
    
    @abstractmethod
    def get_embedding_dimension(self) -> int:
        """Get the dimension of embeddings produced by this provider."""
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        """Get the name of the model used by this provider."""
        pass
    
    @abstractmethod
    def chunk_text(self, text: str, max_tokens: int = 512) -> List[str]:
        """
        Chunk text into smaller pieces for embedding.
        
        Args:
            text: Text to chunk
            max_tokens: Maximum tokens per chunk
            
        Returns:
            List of text chunks
        """
        pass


class BaseRerankingProvider(ABC):
    """Abstract base class for reranking providers."""
    
    @abstractmethod
    def __init__(self, config: Dict[str, Any]):
        """Initialize the reranking provider with configuration."""
        pass
    
    @abstractmethod
    def rerank(
        self, 
        query: str, 
        documents: List[Dict[str, Any]], 
        top_n: Optional[int] = None
    ) -> List[RerankResult]:
        """
        Rerank documents based on their relevance to the query.
        
        Args:
            query: Search query
            documents: List of documents to rerank (with 'text' field)
            top_n: Number of top results to return
            
        Returns:
            List of RerankResult objects sorted by relevance
        """
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        """Get the name of the model used by this provider."""
        pass
    
    @abstractmethod
    def get_max_documents(self) -> int:
        """Get the maximum number of documents this provider can handle."""
        pass


class ProviderConfig:
    """Configuration for providers."""
    
    def __init__(self, provider_type: str, **kwargs):
        self.provider_type = provider_type
        self.config = kwargs
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value."""
        return self.config.get(key, default)
    
    def set(self, key: str, value: Any) -> None:
        """Set configuration value."""
        self.config[key] = value