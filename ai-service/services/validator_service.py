"""
Main validation service that orchestrates AI operations.
"""

import asyncio
import time
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from config import get_settings
from models import (
    ValidationContext, AIValidationRequest, AIValidationResponse,
    ValidationIssue, AIProposal, TokenUsage, AIProvider, AIModel,
    AIProviderConfig
)
from .ai_service_factory import AIServiceFactory
from .database_service import DatabaseService


class ValidatorService:
    """Main validation service."""
    
    def __init__(self):
        self.settings = get_settings()
        self.db_service = DatabaseService()
        self.ai_services = {}
    
    async def validate_component(self, request: AIValidationRequest) -> AIValidationResponse:
        """Validate a component using AI."""
        
        start_time = time.time()
        
        try:
            # Get or create AI service
            ai_service = await self._get_ai_service(request.ai_provider, request.ai_model)
            
            # Build validation context
            context = await self._build_validation_context(request)
            
            # Perform validation
            issues, proposals, token_usage = await ai_service.validate_component(
                context, request.validation_scope
            )
            
            # Save proposals to database
            saved_proposals = await self._save_proposals(
                request.project_id, proposals, request.component_type, request.component_id
            )
            
            # Log usage
            await self._log_usage(
                request.project_id, request.ai_provider, request.ai_model,
                token_usage, request.validation_scope
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            
            return AIValidationResponse(
                success=True,
                issues=issues,
                proposals=saved_proposals,
                usage_stats={
                    "tokens_used": token_usage.total_tokens,
                    "estimated_cost": token_usage.estimated_cost,
                    "provider": request.ai_provider,
                    "model": request.ai_model
                },
                processing_time_ms=processing_time
            )
            
        except Exception as e:
            print(f"Validation error: {e}")
            return AIValidationResponse(
                success=False,
                issues=[],
                proposals=[],
                usage_stats={},
                processing_time_ms=int((time.time() - start_time) * 1000)
            )
    
    async def _get_ai_service(self, provider: AIProvider, model: AIModel) -> Any:
        """Get or create an AI service instance."""
        
        service_key = f"{provider}_{model}"
        
        if service_key not in self.ai_services:
            # Get API key from settings
            if provider == AIProvider.OPENAI:
                api_key = self.settings.openai_api_key
            elif provider == AIProvider.ANTHROPIC:
                api_key = self.settings.anthropic_api_key
            else:
                raise ValueError(f"Unsupported provider: {provider}")
            
            if not api_key:
                raise ValueError(f"API key not configured for provider: {provider}")
            
            # Create service
            self.ai_services[service_key] = AIServiceFactory.create_service(
                provider=provider,
                model=model,
                api_key=api_key,
                max_tokens=self.settings.max_tokens_per_request,
                timeout=self.settings.request_timeout
            )
        
        return self.ai_services[service_key]
    
    async def _build_validation_context(self, request: AIValidationRequest) -> ValidationContext:
        """Build validation context from request."""
        
        # Get project rules and related components
        project_rules = await self.db_service.get_project_rules(request.project_id)
        related_components = await self.db_service.get_related_components(
            request.project_id, request.component_type, request.component_id
        )
        
        return ValidationContext(
            project_id=request.project_id,
            component_type=request.component_type,
            component_data=request.component_data,
            project_rules=project_rules,
            related_components=related_components,
            user_preferences=request.context_data
        )
    
    async def _save_proposals(
        self, 
        project_id: str, 
        proposals: List[AIProposal],
        component_type: str,
        component_id: Optional[str]
    ) -> List[Dict[str, Any]]:
        """Save proposals to database and return saved data."""
        
        saved_proposals = []
        
        for proposal in proposals:
            proposal_data = {
                "project_id": project_id,
                "proposal_type": proposal.proposal_type,
                "component_type": component_type,
                "component_id": component_id,
                "changes": proposal.changes,
                "rationale": proposal.rationale,
                "confidence": proposal.confidence,
                "evidence": proposal.evidence,
                "estimated_impact": proposal.estimated_impact,
                "status": "pending",
                "expires_at": datetime.utcnow() + timedelta(hours=self.settings.proposal_expiry_hours)
            }
            
            saved_proposal = await self.db_service.create_proposal(proposal_data)
            
            # If database is not available, return the original proposal data
            if not saved_proposal:
                saved_proposal = {
                    "id": f"temp_{len(saved_proposals)}",
                    "project_id": project_id,
                    "proposal_type": proposal.proposal_type,
                    "component_type": component_type,
                    "component_id": component_id,
                    "changes": proposal.changes,
                    "rationale": proposal.rationale,
                    "confidence": proposal.confidence,
                    "evidence": proposal.evidence,
                    "estimated_impact": proposal.estimated_impact,
                    "status": "pending",
                    "created_at": datetime.utcnow().isoformat(),
                    "expires_at": (datetime.utcnow() + timedelta(hours=self.settings.proposal_expiry_hours)).isoformat()
                }
            
            saved_proposals.append(saved_proposal)
        
        return saved_proposals
    
    async def _log_usage(
        self,
        project_id: str,
        provider: AIProvider,
        model: AIModel,
        token_usage: TokenUsage,
        validation_scope: str
    ):
        """Log AI usage to database."""
        
        usage_data = {
            "project_id": project_id,
            "ai_provider": provider,
            "ai_model": model,
            "operation_type": "validation",
            "validation_scope": validation_scope,
            "tokens_used": token_usage.total_tokens,
            "estimated_cost": token_usage.estimated_cost,
            "timestamp": datetime.utcnow()
        }
        
        await self.db_service.log_ai_usage(usage_data)
    
    async def get_ai_config(self, project_id: str) -> Dict[str, Any]:
        """Get AI configuration for a project."""
        
        # Try to get project-specific config
        config = await self.db_service.get_ai_configuration(project_id)
        
        if config:
            return {
                'provider': config.get('ai_provider', self.settings.default_ai_provider),
                'model': config.get('ai_model', self.settings.default_ai_model)
            }
        
        # Fall back to default settings
        return {
            'provider': self.settings.default_ai_provider,
            'model': self.settings.default_ai_model
        }
    
    def get_ai_service(self, ai_config: Dict[str, Any]):
        """Get AI service instance for the given config."""
        provider = AIProvider(ai_config['provider'])
        model = AIModel(ai_config['model'])
        
        # Create service synchronously (we'll handle async in the caller)
        if provider == AIProvider.OPENAI:
            api_key = self.settings.openai_api_key
        elif provider == AIProvider.ANTHROPIC:
            api_key = self.settings.anthropic_api_key
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        if not api_key:
            raise ValueError(f"API key not configured for provider: {provider}")
        
        return AIServiceFactory.create_service(
            provider=provider,
            model=model,
            api_key=api_key,
            max_tokens=self.settings.max_tokens_per_request,
            timeout=self.settings.request_timeout
        )
    
    async def test_ai_connections(self) -> Dict[str, bool]:
        """Test connections to all configured AI providers."""
        
        results = {}
        
        # Test OpenAI
        if self.settings.openai_api_key:
            try:
                openai_service = await self._get_ai_service(AIProvider.OPENAI, AIModel.GPT_4O_MINI)
                results["openai"] = await openai_service.test_connection()
            except Exception as e:
                print(f"OpenAI connection test failed: {e}")
                results["openai"] = False
        else:
            results["openai"] = False
        
        # Test Anthropic
        if self.settings.anthropic_api_key:
            try:
                anthropic_service = await self._get_ai_service(AIProvider.ANTHROPIC, AIModel.CLAUDE_3_HAIKU)
                results["anthropic"] = await anthropic_service.test_connection()
            except Exception as e:
                print(f"Anthropic connection test failed: {e}")
                results["anthropic"] = False
        else:
            results["anthropic"] = False
        
        return results
