"""
Factory for creating embedding and reranking providers.
"""

import logging
from typing import Dict, Any, Type, Optional, List
from enum import Enum

from .base import BaseEmbeddingProvider, BaseRerankingProvider, ProviderConfig
from .cohere_provider import CohereEmbeddingProvider, CohereRerankingProvider

logger = logging.getLogger(__name__)


class ProviderType(Enum):
    """Available provider types."""
    SENTENCE_TRANSFORMERS = "sentence_transformers"
    COHERE = "cohere"


class EmbeddingProviderFactory:
    """Factory for creating embedding providers."""
    
    @classmethod
    def _get_providers(cls) -> Dict[ProviderType, Type[BaseEmbeddingProvider]]:
        """Get available providers."""
        return {
            ProviderType.COHERE: CohereEmbeddingProvider,
        }
    
    @classmethod
    def create_provider(
        cls, 
        provider_type: ProviderType, 
        config: Dict[str, Any]
    ) -> BaseEmbeddingProvider:
        """Create an embedding provider instance."""
        providers = cls._get_providers()
        
        if provider_type not in providers:
            available_providers = list(providers.keys())
            if provider_type == ProviderType.SENTENCE_TRANSFORMERS:
                raise ImportError(
                    f"SentenceTransformers provider not available in this deployment. "
                    f"Available providers: {[p.value for p in available_providers]}"
                )
            raise ValueError(f"Unknown embedding provider type: {provider_type}. Available: {[p.value for p in available_providers]}")
        
        provider_class = providers[provider_type]
        
        try:
            provider = provider_class(config)
            logger.info(f"Created embedding provider: {provider_type.value}")
            return provider
        except Exception as e:
            logger.error(f"Error creating embedding provider {provider_type.value}: {e}")
            raise
    
    @classmethod
    def get_available_providers(cls) -> List[str]:
        """Get list of available provider types."""
        return [provider.value for provider in cls._get_providers().keys()]


class RerankingProviderFactory:
    """Factory for creating reranking providers."""
    
    @classmethod
    def _get_providers(cls) -> Dict[ProviderType, Type[BaseRerankingProvider]]:
        """Get available providers."""
        return {
            ProviderType.COHERE: CohereRerankingProvider,
        }
    
    @classmethod
    def create_provider(
        cls, 
        provider_type: ProviderType, 
        config: Dict[str, Any]
    ) -> BaseRerankingProvider:
        """Create a reranking provider instance."""
        providers = cls._get_providers()
        
        if provider_type not in providers:
            available_providers = list(providers.keys())
            if provider_type == ProviderType.SENTENCE_TRANSFORMERS:
                raise ImportError(
                    f"SentenceTransformers provider not available in this deployment. "
                    f"Available providers: {[p.value for p in available_providers]}"
                )
            raise ValueError(f"Unknown reranking provider type: {provider_type}. Available: {[p.value for p in available_providers]}")
        
        provider_class = providers[provider_type]
        
        try:
            provider = provider_class(config)
            logger.info(f"Created reranking provider: {provider_type.value}")
            return provider
        except Exception as e:
            logger.error(f"Error creating reranking provider {provider_type.value}: {e}")
            raise
    
    @classmethod
    def get_available_providers(cls) -> List[str]:
        """Get list of available provider types."""
        return [provider.value for provider in cls._get_providers().keys()]


class ProviderManager:
    """Manager for embedding and reranking providers."""
    
    def __init__(self, config: Dict[str, Any]):
        """Initialize provider manager with configuration."""
        self.config = config
        self._embedding_provider: Optional[BaseEmbeddingProvider] = None
        self._reranking_provider: Optional[BaseRerankingProvider] = None
    
    def get_embedding_provider(self) -> BaseEmbeddingProvider:
        """Get or create embedding provider."""
        if self._embedding_provider is None:
            provider_type_str = self.config.get('embedding_provider', 'cohere')
            provider_type = ProviderType(provider_type_str)
            
            # Get provider-specific config
            provider_config = self.config.get('embedding_config', {})
            
            self._embedding_provider = EmbeddingProviderFactory.create_provider(
                provider_type, 
                provider_config
            )
        
        return self._embedding_provider
    
    def get_reranking_provider(self) -> BaseRerankingProvider:
        """Get or create reranking provider."""
        if self._reranking_provider is None:
            provider_type_str = self.config.get('reranking_provider', 'cohere')
            provider_type = ProviderType(provider_type_str)
            
            # Get provider-specific config
            provider_config = self.config.get('reranking_config', {})
            
            self._reranking_provider = RerankingProviderFactory.create_provider(
                provider_type, 
                provider_config
            )
        
        return self._reranking_provider
    
    def set_embedding_provider(self, provider: BaseEmbeddingProvider) -> None:
        """Set embedding provider."""
        self._embedding_provider = provider
    
    def set_reranking_provider(self, provider: BaseRerankingProvider) -> None:
        """Set reranking provider."""
        self._reranking_provider = provider
    
    def reset_providers(self) -> None:
        """Reset all providers (forces recreation on next access)."""
        self._embedding_provider = None
        self._reranking_provider = None