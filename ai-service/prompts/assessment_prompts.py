"""
Assessment prompt templates and utilities.

This module provides default prompts for project assessment and functions
to build custom prompts from user configuration.
"""

from typing import Dict, Any


def get_assessment_prompt(config: Dict[str, Any], context_data: Dict[str, Any]) -> str:
    """
    Build assessment prompt using custom config or defaults.
    
    Args:
        config: AI configuration with optional custom prompts
        context_data: Project data to analyze
    
    Returns:
        Complete prompt string for AI assessment
    """
    
    # Use custom system prompt if available
    system_prompt = config.get('assessment_prompt_system') or get_default_system_prompt()
    
    # Use custom categories if available
    categories = config.get('assessment_prompt_categories') or get_default_categories()
    
    # Use custom output format if available
    output_format = config.get('assessment_prompt_output_format') or get_default_output_format()
    
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
{format_tasks(context_data['tasks'])}

Dependencies:
{format_dependencies(context_data['dependencies'])}

Analysis Categories:
{categories}

{output_format}

Focus on the most important 5-15 insights. Prioritize observations that could have significant impact on project success."""
    
    return prompt


def get_default_system_prompt() -> str:
    """Default system prompt for project assessment."""
    return """You are a project management expert analyzing a software project.
Your role is to identify patterns, potential issues, and observations that could help the project manager make better decisions.

Generate insights (not actionable proposals) - observations that are worth noting but don't require immediate changes.
Focus on patterns, risks, and opportunities that might not be immediately obvious.

Quality Guidelines:
- Be specific and actionable for awareness
- Have clear evidence from the data
- Could materially impact project outcomes
- Are non-obvious (not just stating what's visible)

Avoid insights that:
- Are purely cosmetic (e.g., "Consider better task names")
- State the obvious (e.g., "Project has incomplete tasks")
- Are based on assumptions without data
- Duplicate other insights
- Are too vague to be useful"""


def get_default_categories() -> str:
    """Default categories to analyze."""
    return """Analyze these categories:

**Task Quality Issues:**
- Tasks with vague or incomplete descriptions
- Missing acceptance criteria
- Priority inconsistencies (all high, or none set)
- Unrealistic time estimates (or missing estimates)
- Tasks stuck in progress for unusually long periods

**Dependency Concerns:**
- Circular dependencies
- Long dependency chains that could cause delays
- Bottleneck tasks (many tasks depend on one)
- Tasks blocked for extended periods
- Missing dependencies that should probably exist

**Velocity/Progress Patterns:**
- Completion rate trending down over time
- Tasks consistently taking longer than estimated
- Status distribution anomalies (80% still in todo)
- Milestone at risk based on current velocity
- Sprint/iteration patterns (if applicable)

**Risk Indicators:**
- High-priority tasks not started
- Critical path tasks with no owner assigned
- Dependencies on external teams/systems
- Technical debt patterns
- Resource constraints (one person assigned to too many)

**Resource Allocation Observations:**
- Uneven workload distribution
- Tasks without owners
- Team members overallocated
- Skills mismatch (if context available)"""


def get_default_output_format() -> str:
    """Default output format instructions."""
    return """Return a JSON array of insights. Each insight should have:

{
  "insight_type": "descriptive category (e.g., 'Task Quality Issue', 'Dependency Bottleneck')",
  "rationale": "Clear 1-2 sentence observation about what you noticed",
  "evidence": ["Specific example 1", "Specific example 2", "..."],
  "confidence": "high|medium|low based on data clarity",
  "estimated_impact": "Brief description of potential effect on project success"
}

Confidence Guidelines:
- **High confidence**: Based on clear, quantifiable data (e.g., "10 out of 12 tasks are missing descriptions")
- **Medium confidence**: Pattern requires interpretation (e.g., "Velocity appears to be slowing based on recent trends")
- **Low confidence**: Inferred from incomplete data or assumptions (e.g., "This might indicate scope creep, but could also be normal complexity")

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


def format_tasks(tasks: list) -> str:
    """Format tasks for the prompt."""
    if not tasks:
        return "No tasks found"
    
    formatted = []
    for task in tasks[:20]:  # Limit to first 20 tasks
        title = task.get('title', 'Untitled')
        status = task.get('status', 'unknown')
        description = task.get('description', 'No description')[:100]
        priority = task.get('priority', 'unset')
        owner = task.get('owner_name', task.get('owner', 'Unassigned'))
        
        formatted.append(f"- {title} ({status}, {priority}) - {owner} - {description}")
    
    if len(tasks) > 20:
        formatted.append(f"... and {len(tasks) - 20} more tasks")
    
    return "\n".join(formatted)


def format_dependencies(dependencies: list) -> str:
    """Format dependencies for the prompt."""
    if not dependencies:
        return "No dependencies found"
    
    formatted = []
    for dep in dependencies[:10]:  # Limit to first 10 dependencies
        task_id = dep.get('task_id', 'unknown')
        depends_on = dep.get('depends_on_task_id', 'unknown')
        dep_type = dep.get('dependency_type', 'finish_to_start')
        
        formatted.append(f"- Task {task_id} depends on {depends_on} ({dep_type})")
    
    if len(dependencies) > 10:
        formatted.append(f"... and {len(dependencies) - 10} more dependencies")
    
    return "\n".join(formatted)


def get_sample_prompt_preview() -> str:
    """Get a sample prompt preview for the UI."""
    sample_context = {
        'project_name': 'Sample Project',
        'project_status': 'active',
        'project_description': 'A sample project for demonstration',
        'task_count': 15,
        'completed_tasks': 5,
        'completion_percentage': 33.3,
        'status_breakdown': {'todo': 8, 'in_progress': 2, 'done': 5},
        'priority_breakdown': {'low': 2, 'medium': 10, 'high': 3},
        'total_estimated_hours': 120,
        'total_dependencies': 8,
        'tasks': [
            {'title': 'Setup development environment', 'status': 'done', 'priority': 'high', 'owner': 'Alice', 'description': 'Configure local development setup'},
            {'title': 'Implement user authentication', 'status': 'in_progress', 'priority': 'high', 'owner': 'Bob', 'description': 'Add login and registration features'},
            {'title': 'Write tests', 'status': 'todo', 'priority': 'medium', 'owner': 'Unassigned', 'description': ''}
        ],
        'dependencies': [
            {'task_id': '2', 'depends_on_task_id': '1', 'dependency_type': 'finish_to_start'}
        ]
    }
    
    return get_assessment_prompt({}, sample_context)

