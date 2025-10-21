#!/usr/bin/env python3
"""
Basic test for the AI service without requiring API keys.
"""

import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test that all modules can be imported."""
    
    print("Testing AI Service Imports...")
    
    try:
        from config import get_settings
        print("Config module imported successfully")
        
        from models import AIValidationRequest, AIProvider, AIModel
        print("Models module imported successfully")
        
        from services.validator_service import ValidatorService
        print("Validator service imported successfully")
        
        from services.openai_service import OpenAIService
        print("OpenAI service imported successfully")
        
        from services.anthropic_service import AnthropicService
        print("Anthropic service imported successfully")
        
        from services.ai_service_factory import AIServiceFactory
        print("AI service factory imported successfully")
        
        from services.database_service import DatabaseService
        print("Database service imported successfully")
        
        print("\nAll imports successful!")
        return True
        
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False


def test_config():
    """Test configuration loading."""
    
    print("\nTesting Configuration...")
    
    try:
        from config import get_settings
        settings = get_settings()
        
        print(f"API Host: {settings.api_host}")
        print(f"API Port: {settings.api_port}")
        print(f"Debug Mode: {settings.api_debug}")
        print(f"Default Provider: {settings.default_ai_provider}")
        print(f"Default Model: {settings.default_ai_model}")
        
        return True
        
    except Exception as e:
        print(f"Configuration error: {e}")
        return False


def test_models():
    """Test model creation."""
    
    print("\nTesting Models...")
    
    try:
        from models import AIValidationRequest, AIProvider, AIModel, ComponentType
        
        # Test creating a validation request
        request = AIValidationRequest(
            project_id="test-project",
            component_type=ComponentType.TASK,
            component_data={"title": "Test task", "status": "todo"},
            validation_scope="selective",
            ai_provider=AIProvider.OPENAI,
            ai_model=AIModel.GPT_4O_MINI
        )
        
        print(f"Validation request created: {request.project_id}")
        print(f"Component type: {request.component_type}")
        print(f"AI provider: {request.ai_provider}")
        print(f"AI model: {request.ai_model}")
        
        return True
        
    except Exception as e:
        print(f"Model error: {e}")
        return False


def main():
    """Run all basic tests."""
    
    print("Helm AI Service - Basic Tests")
    print("=" * 50)
    
    tests = [
        test_imports,
        test_config,
        test_models
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("All basic tests passed! The AI service is ready.")
        print("\nNext steps:")
        print("1. Set up your API keys in .env file")
        print("2. Run: python start.py")
        print("3. Test with: python test_service.py")
    else:
        print("Some tests failed. Please check the errors above.")


if __name__ == "__main__":
    main()
