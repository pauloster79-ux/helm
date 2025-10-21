"""
Base AI service class with common functionality.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from models import TokenUsage, AIProviderConfig, ValidationContext, AIProposal, ValidationIssue


class BaseAIService(ABC):
    """Base class for AI services."""
    
    def __init__(self, config: AIProviderConfig):
        self.config = config
    
    @abstractmethod
    async def validate_component(
        self, 
        context: ValidationContext,
        validation_scope: str = "selective"
    ) -> tuple[List[ValidationIssue], List[AIProposal], TokenUsage]:
        """Validate a component using the AI service."""
        pass
    
    @abstractmethod
    async def answer_question(
        self,
        question: str,
        project_id: str,
        context_data: Optional[Dict[str, Any]] = None
    ) -> tuple[str, List[str], TokenUsage]:
        """Answer a user question.
        
        Returns:
            tuple: (answer_text, evidence_list, token_usage)
        """
        pass
    
    @abstractmethod
    async def test_connection(self) -> bool:
        """Test the AI service connection."""
        pass
    
    @abstractmethod
    async def generate_insights(
        self,
        prompt: str,
        project_id: str,
        context_data: Optional[Dict[str, Any]] = None
    ) -> tuple[str, TokenUsage]:
        """Generate project assessment insights.
        
        Returns:
            tuple: (insights_json_string, token_usage)
        """
        pass
    
    def get_provider_name(self) -> str:
        """Get the provider name."""
        return self.config.provider
    
    def get_model_name(self) -> str:
        """Get the model name."""
        return self.config.model
