"""
Factory for creating AI service instances.
"""

from typing import Optional
from models import AIProviderConfig, AIProvider, AIModel
from .base_ai_service import BaseAIService
from .openai_service import OpenAIService
from .anthropic_service import AnthropicService


class AIServiceFactory:
    """Factory for creating AI service instances."""
    
    @staticmethod
    def create_service(
        provider: AIProvider,
        model: AIModel,
        api_key: str,
        max_tokens: int = 4000,
        temperature: float = 0.1,
        timeout: int = 30
    ) -> BaseAIService:
        """Create an AI service instance."""
        
        config = AIProviderConfig(
            provider=provider,
            model=model,
            api_key=api_key,
            max_tokens=max_tokens,
            temperature=temperature,
            timeout=timeout
        )
        
        if provider == AIProvider.OPENAI:
            return OpenAIService(config)
        elif provider == AIProvider.ANTHROPIC:
            return AnthropicService(config)
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")
    
    @staticmethod
    def get_available_models(provider: AIProvider) -> list[AIModel]:
        """Get available models for a provider."""
        
        if provider == AIProvider.OPENAI:
            return [AIModel.GPT_4O_MINI, AIModel.GPT_4O]
        elif provider == AIProvider.ANTHROPIC:
            return [AIModel.CLAUDE_3_HAIKU, AIModel.CLAUDE_3_SONNET]
        else:
            return []
    
    @staticmethod
    def get_default_model(provider: AIProvider) -> AIModel:
        """Get the default model for a provider."""
        
        if provider == AIProvider.OPENAI:
            return AIModel.GPT_4O_MINI
        elif provider == AIProvider.ANTHROPIC:
            return AIModel.CLAUDE_3_HAIKU
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")
