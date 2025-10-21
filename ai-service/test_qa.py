#!/usr/bin/env python3
"""
Test script for Q&A functionality.
"""

import asyncio
import sys
import os

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.validator_service import ValidatorService
from services.database_service import DatabaseService

async def test_qa():
    """Test Q&A functionality."""
    
    print("Testing Q&A functionality...")
    
    # Initialize services
    validator_service = ValidatorService()
    db_service = validator_service.db_service
    
    # Test project ID (you'll need to replace this with a real project ID)
    test_project_id = "test-project-123"
    
    try:
        # Test 1: Check database connection
        print("\n1. Testing database connection...")
        if db_service.supabase is None:
            print("   [X] Database not configured (SUPABASE_URL and SUPABASE_SERVICE_KEY needed)")
            print("   This is expected if you haven't set up the .env file yet.")
        else:
            print("   [OK] Database connection available")
        
        # Test 2: Check AI configuration
        print("\n2. Testing AI configuration...")
        ai_config = await validator_service.get_ai_config(test_project_id)
        print(f"   Provider: {ai_config['provider']}")
        print(f"   Model: {ai_config['model']}")
        
        # Test 3: Check API keys
        print("\n3. Testing API keys...")
        settings = validator_service.settings
        if settings.openai_api_key:
            print("   [OK] OpenAI API key configured")
        else:
            print("   [X] OpenAI API key not configured")
            
        if settings.anthropic_api_key:
            print("   [OK] Anthropic API key configured")
        else:
            print("   [X] Anthropic API key not configured")
        
        # Test 4: Test AI service creation
        print("\n4. Testing AI service creation...")
        try:
            ai_service = validator_service.get_ai_service(ai_config)
            print(f"   [OK] AI service created: {ai_service.__class__.__name__}")
        except Exception as e:
            print(f"   [X] Failed to create AI service: {e}")
        
        # Test 5: Test project context fetching (if database is available)
        if db_service.supabase is not None:
            print("\n5. Testing project context fetching...")
            try:
                context = await db_service.get_project_context(test_project_id)
                if context.get('project'):
                    print(f"   [OK] Project found: {context['project']['name']}")
                    print(f"   Tasks: {context['stats']['total_tasks']}")
                    print(f"   Completion: {context['stats']['completion_percentage']}%")
                else:
                    print(f"   [!] Project {test_project_id} not found (this is expected for test)")
            except Exception as e:
                print(f"   [X] Failed to fetch project context: {e}")
        
        print("\n[OK] Basic tests completed!")
        print("\nTo test with a real project:")
        print("1. Set up your .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY")
        print("2. Replace test_project_id with a real project ID from your database")
        print("3. Run: python start.py")
        print("4. Test the /answer-question endpoint with a real project")
        
    except Exception as e:
        print(f"\n[X] Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_qa())
