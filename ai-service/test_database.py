#!/usr/bin/env python3
"""
Test script to verify Supabase database connection and project data access.
"""

import asyncio
import sys
from services.database_service import DatabaseService

async def test_database_connection():
    """Test the database connection and data access."""
    
    print("Testing Supabase Database Connection")
    print("=" * 40)
    
    # Initialize database service
    db_service = DatabaseService()
    
    if not db_service.supabase:
        print("ERROR: Database service not initialized - check your .env file")
        print("   Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set")
        return False
    
    print("SUCCESS: Database service initialized")
    
    # Test basic connection
    try:
        print("\nTesting basic connection...")
        # Try to get a simple query
        result = db_service.supabase.table("projects").select("id").limit(1).execute()
        print(f"   SUCCESS: Connection successful")
    except Exception as e:
        print(f"   ERROR: Connection failed: {e}")
        return False
    
    # Test project context retrieval
    try:
        print("\nTesting project context retrieval...")
        project_id = "test-project"  # Use a test project ID
        
        context = await db_service.get_project_context(project_id)
        
        if context.get("project"):
            print(f"   SUCCESS: Project found: {context['project'].get('name', 'Unknown')}")
            print(f"   Tasks: {context['stats']['total_tasks']}")
            print(f"   Completed: {context['stats']['completed_tasks']}")
            print(f"   Progress: {context['stats']['completion_percentage']}%")
        else:
            print(f"   WARNING: No project found with ID: {project_id}")
            print(f"   This is normal if the project doesn't exist yet")
        
        return True
        
    except Exception as e:
        print(f"   ERROR: Project context retrieval failed: {e}")
        return False

async def test_ai_service():
    """Test the AI service with database access."""
    
    print("\nTesting AI Service with Database Access")
    print("=" * 40)
    
    try:
        from services.validator_service import ValidatorService
        
        validator = ValidatorService()
        
        # Test AI configuration
        ai_config = await validator.get_ai_config("test-project")
        print(f"   SUCCESS: AI Config: {ai_config['provider']} - {ai_config['model']}")
        
        # Test AI service creation
        ai_service = validator.get_ai_service(ai_config)
        print(f"   SUCCESS: AI Service: {ai_service.get_provider_name()}")
        
        # Test connection
        connection_ok = await ai_service.test_connection()
        if connection_ok:
            print(f"   SUCCESS: AI Provider connection successful")
        else:
            print(f"   ERROR: AI Provider connection failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"   ERROR: AI service test failed: {e}")
        return False

async def main():
    """Main test function."""
    
    print("Helm AI Service Database Test")
    print("=" * 50)
    
    # Test database connection
    db_ok = await test_database_connection()
    
    # Test AI service
    ai_ok = await test_ai_service()
    
    print(f"\nTest Results:")
    print(f"   Database Connection: {'PASS' if db_ok else 'FAIL'}")
    print(f"   AI Service: {'PASS' if ai_ok else 'FAIL'}")
    
    if db_ok and ai_ok:
        print(f"\nAll tests passed! The Project Assistant should now be able to view tasks.")
    else:
        print(f"\nSome tests failed. Check the configuration and try again.")
    
    return db_ok and ai_ok

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print(f"\n\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        sys.exit(1)
