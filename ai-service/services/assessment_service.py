"""
Project Assessment Service for generating AI insights.

This service analyzes project data to generate insights about:
- Task quality issues
- Dependency concerns
- Velocity/progress patterns
- Risk indicators
- Resource allocation observations
"""

import json
import time
from typing import List, Dict, Any, Optional
from datetime import datetime

from models import AIProposal, ActivityType, ProposalType, ConfidenceLevel
from .database_service import DatabaseService
from .ai_service_factory import AIServiceFactory
from config import get_settings


class ProjectAssessmentService:
    """Service for generating project assessment insights."""
    
    def __init__(self):
        self.settings = get_settings()
        self.db_service = DatabaseService()
        self.ai_services = {}
    
    async def assess_project(self, project_id: str, ai_config: Dict[str, Any]) -> List[AIProposal]:
        """Assess a project and generate insights."""
        
        # Get project context
        project_context = await self.db_service.get_project_context(project_id)
        
        # If database is not available, create mock context for testing
        if not project_context.get("project"):
            print(f"[DEBUG] Database not available, using mock context for project {project_id}")
            context_data = self._create_mock_context()
        else:
            # Format context data for AI
            context_data = {
                'project_name': project_context['project'].get('name'),
                'project_description': project_context['project'].get('description'),
                'project_status': project_context['project'].get('status'),
                'task_count': project_context['stats']['total_tasks'],
                'completed_tasks': project_context['stats']['completed_tasks'],
                'completion_percentage': project_context['stats']['completion_percentage'],
                'status_breakdown': project_context['stats']['status_breakdown'],
                'priority_breakdown': project_context['stats']['priority_breakdown'],
                'total_estimated_hours': project_context['stats']['total_estimated_hours'],
                'total_dependencies': project_context['stats']['total_dependencies'],
                'tasks': project_context['tasks'],
                'dependencies': project_context['dependencies']
            }
        
        # Get AI service
        ai_service = self._get_ai_service(ai_config)
        
        # Get custom prompts if available
        custom_prompts = await self._get_custom_prompts(project_id)
        
        # Build assessment prompt
        assessment_prompt = self._build_assessment_prompt(context_data, custom_prompts)
        
        # Call AI service
        insights_data, token_usage = await ai_service.generate_insights(
            prompt=assessment_prompt,
            project_id=project_id,
            context_data=context_data
        )
        
        # Parse insights
        insights = self._parse_insights(insights_data)
        
        # Log usage
        await self._log_usage(project_id, ai_config, token_usage)
        
        return insights
    
    def _get_ai_service(self, ai_config: Dict[str, Any]):
        """Get AI service instance."""
        provider = ai_config['provider']
        model = ai_config['model']
        
        service_key = f"{provider}_{model}"
        
        if service_key not in self.ai_services:
            # Get API key from settings
            if provider == 'openai':
                api_key = self.settings.openai_api_key
            elif provider == 'anthropic':
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
    
    async def _get_custom_prompts(self, project_id: str) -> Dict[str, Any]:
        """Get custom prompts from AI configuration."""
        try:
            config = await self.db_service.get_ai_configuration(project_id)
            if config:
                return {
                    'system_prompt': config.get('assessment_prompt_system'),
                    'categories': config.get('assessment_prompt_categories'),
                    'output_format': config.get('assessment_prompt_output_format')
                }
        except Exception as e:
            print(f"Error getting custom prompts: {e}")
        
        return {}
    
    def _build_assessment_prompt(self, context_data: Dict[str, Any], custom_prompts: Dict[str, Any]) -> str:
        """Build the assessment prompt with context data."""
        
        # Use custom system prompt if available
        system_prompt = custom_prompts.get('system_prompt') or self._get_default_system_prompt()
        
        # Use custom categories if available
        categories = custom_prompts.get('categories') or self._get_default_categories()
        
        # Use custom output format if available
        output_format = custom_prompts.get('output_format') or self._get_default_output_format()
        
        # Build the complete prompt
        prompt = f"""{system_prompt}

Project: {context_data['project_name']}
Status: {context_data['project_status']}
Description: {context_data.get('project_description', 'No description')}

Task Summary:
- Total tasks: {context_data['task_count']}
- Completed: {context_data['completed_tasks']}
- Completion: {context_data['completion_percentage']:.1f}%
- Status breakdown: {context_data['status_breakdown']}
- Priority breakdown: {context_data['priority_breakdown']}
- Estimated hours: {context_data['total_estimated_hours']}
- Dependencies: {context_data['total_dependencies']}

Tasks:
{self._format_tasks(context_data['tasks'])}

Dependencies:
{self._format_dependencies(context_data['dependencies'])}

Analysis Categories:
{categories}

{output_format}

Focus on the most important 5-15 insights. Prioritize observations that could have significant impact on project success."""
        
        return prompt
    
    def _get_default_system_prompt(self) -> str:
        """Default system prompt for project assessment."""
        return """You are a project management expert analyzing a software project.
Your role is to identify patterns, potential issues, and observations that could help the project manager make better decisions.

Generate insights (not actionable proposals) - observations that are worth noting but don't require immediate changes.
Focus on patterns, risks, and opportunities that might not be immediately obvious."""
    
    def _get_default_categories(self) -> str:
        """Default categories to analyze."""
        return """Analyze these categories:

**Task Quality Issues:**
- Tasks with vague or incomplete descriptions
- Missing acceptance criteria
- Priority inconsistencies
- Unrealistic time estimates
- Tasks stuck in progress

**Dependency Concerns:**
- Circular dependencies
- Long dependency chains
- Bottleneck tasks
- Missing dependencies
- Blocked tasks

**Velocity/Progress Patterns:**
- Completion rate trends
- Tasks taking longer than estimated
- Status distribution anomalies
- Milestone risks
- Progress bottlenecks

**Risk Indicators:**
- High-priority tasks not started
- Critical path issues
- External dependencies
- Resource constraints
- Technical debt patterns

**Resource Allocation:**
- Uneven workload distribution
- Tasks without owners
- Skills mismatch
- Overallocation"""
    
    def _get_default_output_format(self) -> str:
        """Default output format instructions."""
        return """Return a JSON array of insights. Each insight should have:

{
  "insight_type": "descriptive category (e.g., 'Task Quality Issue', 'Dependency Bottleneck')",
  "rationale": "Clear 1-2 sentence observation about what you noticed",
  "evidence": ["Specific example 1", "Specific example 2", "..."],
  "confidence": "high|medium|low based on data clarity",
  "estimated_impact": "Brief description of potential effect on project success"
}

Example:
{
  "insight_type": "Velocity Concern",
  "rationale": "Task completion rate has decreased 40% over the past two weeks, suggesting potential blockers or scope creep.",
  "evidence": [
    "Week 1: 12 tasks completed",
    "Week 2: 8 tasks completed", 
    "Week 3: 7 tasks completed"
  ],
  "confidence": "high",
  "estimated_impact": "At current velocity, the project may miss the deadline by 1-2 weeks"
}"""
    
    def _format_tasks(self, tasks: List[Dict]) -> str:
        """Format tasks for the prompt."""
        if not tasks:
            return "No tasks found"
        
        formatted = []
        for task in tasks[:20]:  # Limit to first 20 tasks
            formatted.append(f"- {task.get('title', 'Untitled')} ({task.get('status', 'unknown')}) - {task.get('description', 'No description')[:100]}")
        
        if len(tasks) > 20:
            formatted.append(f"... and {len(tasks) - 20} more tasks")
        
        return "\n".join(formatted)
    
    def _format_dependencies(self, dependencies: List[Dict]) -> str:
        """Format dependencies for the prompt."""
        if not dependencies:
            return "No dependencies found"
        
        formatted = []
        for dep in dependencies[:10]:  # Limit to first 10 dependencies
            formatted.append(f"- Task {dep.get('task_id', 'unknown')} depends on {dep.get('depends_on_task_id', 'unknown')}")
        
        if len(dependencies) > 10:
            formatted.append(f"... and {len(dependencies) - 10} more dependencies")
        
        return "\n".join(formatted)
    
    def _create_mock_context(self) -> Dict[str, Any]:
        """Create mock context for testing when database is not available."""
        return {
            'project_name': 'Build a garden shed',
            'project_description': 'A project to build a garden shed',
            'project_status': 'active',
            'task_count': 5,
            'completed_tasks': 0,
            'completion_percentage': 0.0,
            'status_breakdown': {'todo': 4, 'in_progress': 1, 'done': 0},
            'priority_breakdown': {'low': 0, 'medium': 5, 'high': 0},
            'total_estimated_hours': 0,
            'total_dependencies': 0,
            'tasks': [
                {'id': '1', 'title': 'Go to the shops and chat up an assistant', 'description': 'See if they are up for it!', 'status': 'todo', 'priority': 'medium'},
                {'id': '2', 'title': 'red cat', 'status': 'in_progress', 'priority': 'medium'},
                {'id': '3', 'title': 'rrr', 'status': 'todo', 'priority': 'medium'},
                {'id': '4', 'title': 'gggggg', 'status': 'todo', 'priority': 'medium'},
                {'id': '5', 'title': 'Go to B&Q and purchase the wood for the shed', 'description': 'Go to B&Q and purchase the wood for the shed', 'status': 'todo', 'priority': 'medium'}
            ],
            'dependencies': []
        }
    
    def _parse_insights(self, insights_data: str) -> List[AIProposal]:
        """Parse AI response into insight proposals."""
        insights = []
        
        try:
            # Try to parse as JSON array
            insights_json = json.loads(insights_data)
            
            if not isinstance(insights_json, list):
                insights_json = [insights_json]
            
            for insight_data in insights_json:
                if isinstance(insight_data, dict):
                    insight = AIProposal(
                        activity_type=ActivityType.INSIGHT,
                        proposal_type=None,  # Insights don't have proposal types
                        component_type=None,  # Project-wide insights
                        component_id=None,
                        changes=None,  # Insights don't propose changes
                        rationale=insight_data.get('rationale', ''),
                        confidence=self._parse_confidence(insight_data.get('confidence', 'medium')),
                        evidence=insight_data.get('evidence', []),
                        estimated_impact=insight_data.get('estimated_impact', ''),
                        parent_id=None
                    )
                    insights.append(insight)
        
        except json.JSONDecodeError as e:
            print(f"Error parsing insights JSON: {e}")
            print(f"Raw response: {insights_data}")
            
            # Fallback: create a single insight from the raw text
            insight = AIProposal(
                activity_type=ActivityType.INSIGHT,
                rationale=insights_data[:500],  # Truncate if too long
                confidence=ConfidenceLevel.MEDIUM,
                evidence=[],
                estimated_impact="Unable to parse structured insights"
            )
            insights.append(insight)
        
        return insights
    
    def _parse_confidence(self, confidence_str: str) -> ConfidenceLevel:
        """Parse confidence string to enum."""
        confidence_str = confidence_str.lower()
        if 'high' in confidence_str:
            return ConfidenceLevel.HIGH
        elif 'medium' in confidence_str:
            return ConfidenceLevel.MEDIUM
        else:
            return ConfidenceLevel.LOW
    
    async def _log_usage(self, project_id: str, ai_config: Dict[str, Any], token_usage):
        """Log AI usage to database."""
        try:
            usage_data = {
                "project_id": project_id,
                "operation_type": "project_assessment",
                "ai_provider": ai_config['provider'],
                "ai_model": ai_config['model'],
                "input_tokens": getattr(token_usage, 'prompt_tokens', 0),
                "output_tokens": getattr(token_usage, 'completion_tokens', 0),
                "total_tokens": getattr(token_usage, 'total_tokens', 0),
                "estimated_cost": getattr(token_usage, 'estimated_cost', 0),
                "latency_ms": 0,  # Will be set by caller
                "success": True,
                "proposal_ids": []
            }
            
            await self.db_service.log_ai_usage(usage_data)
        
        except Exception as e:
            print(f"Error logging AI usage: {e}")

