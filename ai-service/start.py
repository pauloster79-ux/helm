#!/usr/bin/env python3
"""
Startup script for the AI service.
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from config import get_settings

def main():
    """Start the AI service."""
    
    settings = get_settings()
    
    print("Starting Helm AI Service...")
    print(f"Host: {settings.api_host}")
    print(f"Port: {settings.api_port}")
    print(f"Debug: {settings.api_debug}")
    print(f"OpenAI API Key: {'Set' if settings.openai_api_key else 'Missing'}")
    print(f"Anthropic API Key: {'Set' if settings.anthropic_api_key else 'Missing'}")
    print(f"Supabase URL: {'Set' if settings.supabase_url else 'Missing'}")
    print()
    
    if not settings.openai_api_key and not settings.anthropic_api_key:
        print("Warning: No AI provider API keys configured!")
        print("   Set OPENAI_API_KEY or ANTHROPIC_API_KEY environment variables")
        print()
    
    if not settings.supabase_url or not settings.supabase_service_key:
        print("Warning: Supabase configuration missing!")
        print("   Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables")
        print()
    
    print("Starting server...")
    print("API docs available at: http://localhost:8001/docs")
    print("Health check: http://localhost:8001/health")
    print()
    
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_debug,
        log_level="info"
    )

if __name__ == "__main__":
    main()
