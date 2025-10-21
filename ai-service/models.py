"""
Pydantic models for request/response validation.
"""

from typing import List, Optional, Dict, Any, Literal, Union
from pydantic import BaseModel, Field
from datetime import datetime


# Enums for type safety
from enum import Enum

class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"


class AIModel(str, Enum):
    # OpenAI models
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_4O = "gpt-4o"
    
    # Anthropic models
    CLAUDE_3_HAIKU = "claude-3-haiku-20240307"
    CLAUDE_3_SONNET = "claude-3-sonnet-20240229"


class ValidationScope(str, Enum):
    RULES_ONLY = "rules_only"
    SELECTIVE = "selective"
    FULL = "full"


class ProposalType(str, Enum):
    FIELD_IMPROVEMENT = "field_improvement"
    MISSING_INFORMATION = "missing_information"
    STATUS_CONFLICT = "status_conflict"
    COMPONENT_CREATION = "component_creation"
    RELATIONSHIP_SUGGESTION = "relationship_suggestion"
    DOCUMENT_BASED = "document_based"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ComponentType(str, Enum):
    TASK = "task"
    RISK = "risk"
    DECISION = "decision"
    MILESTONE = "milestone"


class ActivityType(str, Enum):
    """Type of AI activity/response."""
    PROPOSAL = "proposal"  # Actionable suggestion
    INSIGHT = "insight"    # Non-actionable observation
    QUESTION = "question"  # User question
    ANSWER = "answer"      # AI answer to question


# Request Models
class AIValidationRequest(BaseModel):
    """Request model for AI validation."""
    project_id: str = Field(description="Project ID")
    component_type: ComponentType = Field(description="Type of component being validated")
    component_id: Optional[str] = Field(default=None, description="Component ID (if editing existing)")
    component_data: Dict[str, Any] = Field(description="Component data to validate")
    validation_scope: ValidationScope = Field(default=ValidationScope.SELECTIVE, description="Validation scope")
    ai_provider: AIProvider = Field(description="AI provider to use")
    ai_model: AIModel = Field(description="AI model to use")
    context_data: Optional[Dict[str, Any]] = Field(default=None, description="Additional context data")


class ProposalActionRequest(BaseModel):
    """Request model for proposal actions."""
    proposal_id: str = Field(description="Proposal ID")
    action: Literal["accept", "reject", "modify", "defer"] = Field(description="Action to take")
    modifications: Optional[Dict[str, Any]] = Field(default=None, description="Modifications (for modify action)")
    feedback: Optional[str] = Field(default=None, description="Feedback (for reject action)")


class QuestionRequest(BaseModel):
    """Request model for submitting a question."""
    project_id: str = Field(description="Project ID")
    question: str = Field(description="User's question")
    user_id: Optional[str] = Field(default=None, description="User ID (optional)")


class QuestionAnswerRequest(BaseModel):
    """Request model for Q&A (internal)."""
    project_id: str = Field(description="Project ID")
    question_id: str = Field(description="Question ID (from proposals table)")
    question: str = Field(description="User's question")
    ai_provider: AIProvider = Field(description="AI provider to use")
    ai_model: AIModel = Field(description="AI model to use")
    context_data: Optional[Dict[str, Any]] = Field(default=None, description="Additional context data")


# Response Models
class ValidationIssue(BaseModel):
    """Individual validation issue."""
    field: str = Field(description="Field name")
    issue_type: str = Field(description="Type of issue")
    message: str = Field(description="Issue description")
    severity: Literal["error", "warning", "info"] = Field(description="Issue severity")
    suggestion: Optional[str] = Field(default=None, description="Suggested fix")


class AIProposal(BaseModel):
    """AI-generated proposal."""
    activity_type: ActivityType = Field(default=ActivityType.PROPOSAL, description="Type of activity")
    proposal_type: Optional[ProposalType] = Field(default=None, description="Type of proposal (for proposals only)")
    component_type: Optional[ComponentType] = Field(default=None, description="Component type")
    component_id: Optional[str] = Field(default=None, description="Component ID")
    changes: Optional[Dict[str, Any]] = Field(default=None, description="Proposed changes (for proposals only)")
    rationale: str = Field(description="Reasoning/content (proposal rationale, insight description, or answer text)")
    confidence: Optional[ConfidenceLevel] = Field(default=None, description="Confidence level (for proposals only)")
    evidence: List[str] = Field(default=[], description="Supporting evidence")
    estimated_impact: Optional[str] = Field(default=None, description="Estimated impact")
    parent_id: Optional[str] = Field(default=None, description="Parent question ID (for answers only)")


class AIValidationResponse(BaseModel):
    """Response model for AI validation."""
    success: bool = Field(description="Whether validation was successful")
    issues: List[ValidationIssue] = Field(default=[], description="Validation issues found")
    proposals: List[AIProposal] = Field(default=[], description="AI-generated proposals")
    usage_stats: Dict[str, Any] = Field(description="Token usage and cost information")
    processing_time_ms: int = Field(description="Processing time in milliseconds")


class ProposalResponse(BaseModel):
    """Response model for proposal actions."""
    success: bool = Field(description="Whether action was successful")
    message: str = Field(description="Response message")
    updated_proposal: Optional[Dict[str, Any]] = Field(default=None, description="Updated proposal data")


class QuestionAnswerResponse(BaseModel):
    """Response model for Q&A."""
    success: bool = Field(description="Whether answer generation was successful")
    answer: str = Field(description="AI-generated answer")
    evidence: List[str] = Field(default=[], description="Supporting evidence/sources")
    question_id: str = Field(description="Question proposal ID")
    answer_id: str = Field(description="Answer proposal ID")
    usage_stats: Dict[str, Any] = Field(description="Token usage and cost information")
    processing_time_ms: int = Field(description="Processing time in milliseconds")


class HealthResponse(BaseModel):
    """Health check response."""
    status: str = Field(description="Service status")
    timestamp: datetime = Field(description="Response timestamp")
    version: str = Field(description="Service version")
    ai_providers: Dict[str, bool] = Field(description="AI provider availability")


# Internal Models
class TokenUsage(BaseModel):
    """Token usage information."""
    prompt_tokens: int = Field(description="Prompt tokens used")
    completion_tokens: int = Field(description="Completion tokens used")
    total_tokens: int = Field(description="Total tokens used")
    estimated_cost: float = Field(description="Estimated cost in USD")


class AIProviderConfig(BaseModel):
    """AI provider configuration."""
    provider: AIProvider = Field(description="Provider name")
    model: AIModel = Field(description="Model name")
    api_key: str = Field(description="API key")
    max_tokens: int = Field(description="Maximum tokens per request")
    temperature: float = Field(default=0.1, description="Temperature for generation")
    timeout: int = Field(default=30, description="Request timeout in seconds")


class ValidationContext(BaseModel):
    """Context for validation."""
    project_id: str = Field(description="Project ID")
    component_type: ComponentType = Field(description="Component type")
    component_data: Dict[str, Any] = Field(description="Component data")
    project_rules: Optional[List[Dict[str, Any]]] = Field(default=None, description="Project-specific rules")
    related_components: Optional[List[Dict[str, Any]]] = Field(default=None, description="Related components")
    user_preferences: Optional[Dict[str, Any]] = Field(default=None, description="User preferences")
