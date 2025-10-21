#!/usr/bin/env python3
"""
Test script for the AI service.
"""

import asyncio
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from models import AIValidationRequest, AIProvider, AIModel, ComponentType
from services.validator_service import ValidatorService


async def test_validation():
    """Test the validation service."""
    
    print("Testing AI Validation Service...")
    
    # Create validator service
    validator = ValidatorService()
    
    # Test AI connections
    print("Testing AI provider connections...")
    connections = await validator.test_ai_connections()
    
    for provider, status in connections.items():
        status_icon = "OK" if status else "FAIL"
        print(f"   {status_icon} {provider}: {'Connected' if status else 'Failed'}")
    
    if not any(connections.values()):
        print("WARNING: No AI providers are connected. Please check your API keys.")
        return
    
    # Test validation with mock data
    print("\nTesting validation with mock task data...")
    
    request = AIValidationRequest(
        project_id="test-project-123",
        component_type=ComponentType.TASK,
        component_data={
            "id": "task-123",
            "title": "Implement user authentication",
            "description": "Add login and registration functionality",
            "status": "todo",
            "priority": "high",
            "estimated_hours": 8
        },
        validation_scope="selective",
        ai_provider=AIProvider.OPENAI if connections.get("openai") else AIProvider.ANTHROPIC,
        ai_model=AIModel.GPT_4O_MINI if connections.get("openai") else AIModel.CLAUDE_3_HAIKU
    )
    
    try:
        response = await validator.validate_component(request)
        
        print(f"Validation completed successfully!")
        print(f"   Processing time: {response.processing_time_ms}ms")
        print(f"   Issues found: {len(response.issues)}")
        print(f"   Proposals generated: {len(response.proposals)}")
        print(f"   Tokens used: {response.usage_stats.get('tokens_used', 0)}")
        print(f"   Estimated cost: ${response.usage_stats.get('estimated_cost', 0):.4f}")
        
        if response.issues:
            print("\nIssues found:")
            for issue in response.issues:
                print(f"   - {issue.field}: {issue.message} ({issue.severity})")
        
        if response.proposals:
            print("\nProposals generated:")
            for proposal in response.proposals:
                print(f"   - {proposal.proposal_type}: {proposal.rationale}")
        
    except Exception as e:
        print(f"Validation failed: {e}")


async def main():
    """Main test function."""
    
    print("Helm AI Service Test")
    print("=" * 50)
    
    await test_validation()
    
    print("\n" + "=" * 50)
    print("Test completed!")


if __name__ == "__main__":
    asyncio.run(main())
