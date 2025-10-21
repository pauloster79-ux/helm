"""
Configuration management for the AI service.
Loads environment variables and provides typed configuration.
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_host: str = Field(default="0.0.0.0", description="API host")
    api_port: int = Field(default=8001, description="API port")
    api_debug: bool = Field(default=False, description="Debug mode")
    
    # AI Provider Configuration
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key")
    
    # Database Configuration
    supabase_url: Optional[str] = Field(default=None, description="Supabase project URL")
    supabase_service_key: Optional[str] = Field(default=None, description="Supabase service role key")
    
    # AI Service Configuration
    default_ai_provider: str = Field(default="openai", description="Default AI provider")
    default_ai_model: str = Field(default="gpt-4o-mini", description="Default AI model")
    max_tokens_per_request: int = Field(default=4000, description="Max tokens per AI request")
    request_timeout: int = Field(default=30, description="Request timeout in seconds")
    
    # Cost Configuration
    openai_gpt4o_mini_cost_per_1k_tokens: float = Field(default=0.00015, description="GPT-4o-mini cost per 1k tokens")
    openai_gpt4o_cost_per_1k_tokens: float = Field(default=0.005, description="GPT-4o cost per 1k tokens")
    anthropic_claude_3_haiku_cost_per_1k_tokens: float = Field(default=0.00025, description="Claude 3 Haiku cost per 1k tokens")
    anthropic_claude_3_sonnet_cost_per_1k_tokens: float = Field(default=0.003, description="Claude 3 Sonnet cost per 1k tokens")
    
    # Validation Configuration
    max_validation_requests_per_minute: int = Field(default=60, description="Max validation requests per minute")
    proposal_expiry_hours: int = Field(default=24, description="Proposal expiry in hours")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get the global settings instance."""
    return settings
