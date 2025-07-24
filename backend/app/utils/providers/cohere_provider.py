"""
Cohere provider implementation for embedding and reranking services.
"""

import os
import logging
from typing import List, Dict, Any, Optional
from cohere import Client

from .base import (
    BaseEmbeddingProvider, 
    BaseRerankingProvider, 
    EmbeddingResult, 
    RerankResult, 
    EmbeddingInputType
)

logger = logging.getLogger(__name__)


class CohereEmbeddingProvider(BaseEmbeddingProvider):
    """Cohere implementation of embedding provider."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize Cohere embedding provider."""
        self.api_key = config.get('api_key') or os.getenv('COHERE_API_KEY')
        if not self.api_key:
            raise ValueError("Cohere API key is required")
        
        self.client = Client(api_key=self.api_key)
        self.model_name = config.get('model', 'embed-v4.0')
        self.max_tokens = config.get('max_tokens', 512)
        
        # Model dimension mapping
        self.model_dimensions = {
            "embed-v4.0" : 512
        }
        
        logger.info(f"Initialized Cohere embedding provider with model: {self.model_name}")
    
    def generate_embeddings(
        self, 
        texts: List[str], 
        input_type: EmbeddingInputType = EmbeddingInputType.SEARCH_DOCUMENT
    ) -> EmbeddingResult:
        """Generate embeddings using Cohere API."""
        try:
            # Convert our input type to Cohere's input type
            cohere_input_type = self._convert_input_type(input_type)
            
            # Cohere has a limit of 96 texts per request
            batch_size = 96
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                
                response = self.client.embed(
                    texts=batch,
                    model=self.model_name,
                    input_type=cohere_input_type,
                    embedding_types=['float']
                )
                
                all_embeddings.extend(response.embeddings)
            
            return EmbeddingResult(
                embeddings=all_embeddings,
                model_name=self.model_name,
                dimensions=self.get_embedding_dimension(),
                input_type=input_type
            )
            
        except Exception as e:
            logger.error(f"Error generating embeddings with Cohere: {e}")
            raise
    
    def get_embedding_dimension(self) -> int:
        """Get the dimension of embeddings for the current model."""
        return self.model_dimensions.get(self.model_name, 1024)
    
    def get_model_name(self) -> str:
        """Get the name of the model used by this provider."""
        return self.model_name
    
    def chunk_text(self, text: str, max_tokens: int = 512) -> List[str]:
        """
        Chunk text into smaller pieces for embedding.
        Simple implementation - can be enhanced with more sophisticated chunking.
        """
        # Simple word-based chunking
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        # Approximate tokens as words (rough estimate)
        for word in words:
            word_length = len(word.split()) + 1  # +1 for space
            if current_length + word_length > max_tokens and current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = word_length
            else:
                current_chunk.append(word)
                current_length += word_length
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks if chunks else [text]
    
    def _convert_input_type(self, input_type: EmbeddingInputType) -> str:
        """Convert our input type to Cohere's input type."""
        mapping = {
            EmbeddingInputType.SEARCH_DOCUMENT: "search_document",
            EmbeddingInputType.SEARCH_QUERY: "search_query",
            EmbeddingInputType.CLASSIFICATION: "classification",
            EmbeddingInputType.CLUSTERING: "clustering"
        }
        return mapping.get(input_type, "search_document")


class CohereRerankingProvider(BaseRerankingProvider):
    """Cohere implementation of reranking provider."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize Cohere reranking provider."""
        self.api_key = config.get('api_key') or os.getenv('COHERE_API_KEY')
        if not self.api_key:
            raise ValueError("Cohere API key is required")
        
        self.client = Client(api_key=self.api_key)
        self.model_name = config.get('model', 'rerank-v3.5')
        self.max_documents = config.get('max_documents', 1000)
        
        logger.info(f"Initialized Cohere reranking provider with model: {self.model_name}")
    
    def rerank(
        self, 
        query: str, 
        documents: List[Dict[str, Any]], 
        top_n: Optional[int] = None
    ) -> List[RerankResult]:
        """Rerank documents using Cohere API."""
        try:
            if len(documents) > self.max_documents:
                logger.warning(f"Too many documents ({len(documents)}), limiting to {self.max_documents}")
                documents = documents[:self.max_documents]
            
            # Extract text from documents
            doc_texts = []
            for doc in documents:
                if isinstance(doc, dict):
                    text = doc.get('text', str(doc))
                else:
                    text = str(doc)
                doc_texts.append(text)
            
            # Call Cohere rerank API
            response = self.client.rerank(
                query=query,
                documents=doc_texts,
                model=self.model_name,
                top_n=top_n,
                return_documents=True
            )
            
            # Convert response to RerankResult objects
            results = []
            for result in response.results:
                results.append(RerankResult(
                    index=result.index,
                    text=result.document.text,
                    relevance_score=result.relevance_score,
                    original_score=None  # Cohere doesn't provide original scores
                ))
            
            return results
            
        except Exception as e:
            logger.error(f"Error reranking documents with Cohere: {e}")
            raise
    
    def get_model_name(self) -> str:
        """Get the name of the model used by this provider."""
        return self.model_name
    
    def get_max_documents(self) -> int:
        """Get the maximum number of documents this provider can handle."""
        return self.max_documents