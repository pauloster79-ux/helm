"""
OpenAI service for AI operations.
Handles API calls, token counting, and cost calculation.
"""

import asyncio
import time
from typing import List, Dict, Any, Optional
import openai
from openai import AsyncOpenAI
import tiktoken

from config import get_settings
from models import TokenUsage, AIProviderConfig, ValidationContext, AIProposal, ValidationIssue
from .base_ai_service import BaseAIService


class OpenAIService(BaseAIService):
    """OpenAI service implementation."""
    
    def __init__(self, config: AIProviderConfig):
        super().__init__(config)
        self.client = AsyncOpenAI(api_key=config.api_key)
        self.encoding = tiktoken.encoding_for_model(config.model)
        self.settings = get_settings()
    
    async def validate_component(
        self, 
        context: ValidationContext,
        validation_scope: str = "selective"
    ) -> tuple[List[ValidationIssue], List[AIProposal], TokenUsage]:
        """Validate a component using OpenAI."""
        
        start_time = time.time()
        
        try:
            # Build the prompt based on validation scope
            prompt = self._build_validation_prompt(context, validation_scope)
            
            # Make the API call
            response = await self.client.chat.completions.create(
                model=self.config.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
                timeout=self.config.timeout
            )
            
            # Parse the response
            content = response.choices[0].message.content
            issues, proposals = self._parse_validation_response(content, context)
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            total_tokens = response.usage.total_tokens
            
            cost = self._calculate_cost(prompt_tokens, completion_tokens)
            
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost=cost
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            
            return issues, proposals, token_usage
            
        except Exception as e:
            # Log error and return empty results
            print(f"OpenAI validation error: {e}")
            return [], [], TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0
            )
    
    def _build_validation_prompt(self, context: ValidationContext, validation_scope: str) -> str:
        """Build the validation prompt based on context and scope."""
        
        base_prompt = f"""
You are an AI assistant helping with project management validation. Analyze the following {context.component_type} data and provide validation feedback.

Component Data:
{self._format_component_data(context.component_data)}

Project ID: {context.project_id}
Validation Scope: {validation_scope}
"""
        
        if validation_scope == "rules_only":
            return base_prompt + """
Please check for basic rule violations only:
- Required fields are present
- Data types are correct
- Basic format validation
"""
        
        elif validation_scope == "selective":
            return base_prompt + """
Please provide selective validation focusing on:
- Data quality issues
- Missing important information
- Potential improvements
- Consistency with project standards
"""
        
        else:  # full
            return base_prompt + """
Please provide comprehensive validation including:
- All rule violations
- Data quality assessment
- Missing information analysis
- Improvement suggestions
- Consistency checks
- Best practice recommendations
"""
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for OpenAI."""
        return """
You're helping someone write better task titles and descriptions. Give them friendly, natural feedback.

Check these things:
1. **Task Title Quality**: Is it clear, professional, and actionable?
2. **Task Description Quality**: Is it clear what needs to be done?
3. **Title-Description Consistency**: Do the title and description actually match? If the title says "Run a race" but the description talks about "Buy a cat", that doesn't make sense!

CRITICAL: When both title and description exist but don't match, flag this as a "title-description mismatch" issue, NOT a missing title issue.

Return your feedback in this JSON format:
{
  "issues": [{"field": "title", "issue_type": "suggestion", "message": "your friendly feedback here", "severity": "info", "suggestion": "specific alternative"}],
  "proposals": []
}

IMPORTANT DISTINCTIONS:
- **Issues** = Guidance and advice (always provide this when you find problems)
- **Proposals** = Only provide complete, usable alternatives that you can write fully
- **Insights** = Non-actionable observations about patterns, best practices, or project health

For "proposals" (actionable suggestions), only suggest complete alternatives when:
- You can write the ENTIRE replacement text (no placeholders like "[Add criterion]")
- The alternative is immediately usable and actionable
- You're confident it's better than the original
- Include: activity_type="proposal", proposal_type, changes, confidence, evidence

For "insights" (informational observations), provide when you notice:
- Patterns across multiple tasks (e.g., "3 tasks are missing acceptance criteria")
- Best practice opportunities (e.g., "Consider breaking down large tasks")
- Project health observations (e.g., "Most tasks are in progress, consider prioritizing")
- Include: activity_type="insight", rationale (observation), evidence

For "issues", provide guidance when:
- The text is too vague but you can't write a complete alternative
- Missing information but you don't know the specific details
- Format problems but the user needs to fill in the specifics

Example for title-description mismatch:
{
  "issues": [
    {
      "field": "description",
      "issue_type": "inconsistency",
      "message": "The description doesn't match the task title. The title says 'Run a race' but the description mentions 'Buy a cat'. These describe completely different activities.",
      "severity": "error",
      "suggestion": "Update the description to match the title, or change the title to match the description. For example, if the task is about running a race, describe what needs to be done for the race preparation or execution."
    }
  ],
  "proposals": []
}
"""
    
    def _parse_validation_response(
        self, 
        content: str, 
        context: ValidationContext
    ) -> tuple[List[ValidationIssue], List[AIProposal]]:
        """Parse the OpenAI response into structured data."""
        
        try:
            import json
            data = json.loads(content)
            
            issues = []
            for issue_data in data.get("issues", []):
                issues.append(ValidationIssue(**issue_data))
            
            proposals = []
            for proposal_data in data.get("proposals", []):
                # Add context information
                proposal_data["component_type"] = context.component_type
                proposal_data["component_id"] = context.component_data.get("id")
                proposals.append(AIProposal(**proposal_data))
            
            return issues, proposals
            
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(f"Error parsing OpenAI response: {e}")
            return [], []
    
    def _calculate_cost(self, prompt_tokens: int, completion_tokens: int) -> float:
        """Calculate the cost based on token usage."""
        
        # Get cost per 1k tokens based on model
        if self.config.model == "gpt-4o-mini":
            cost_per_1k = self.settings.openai_gpt4o_mini_cost_per_1k_tokens
        elif self.config.model == "gpt-4o":
            cost_per_1k = self.settings.openai_gpt4o_cost_per_1k_tokens
        else:
            # Default to gpt-4o-mini pricing
            cost_per_1k = self.settings.openai_gpt4o_mini_cost_per_1k_tokens
        
        total_tokens = prompt_tokens + completion_tokens
        return (total_tokens / 1000) * cost_per_1k
    
    def _format_component_data(self, data: Dict[str, Any]) -> str:
        """Format component data for the prompt."""
        formatted = []
        for key, value in data.items():
            if value is not None:
                formatted.append(f"{key}: {value}")
        return "\n".join(formatted)
    
    async def test_connection(self) -> bool:
        """Test the OpenAI API connection."""
        try:
            response = await self.client.chat.completions.create(
                model=self.config.model,
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5,
                timeout=10
            )
            return response.choices[0].message.content is not None
        except Exception as e:
            print(f"OpenAI connection test failed: {e}")
            return False
    
    async def answer_question(
        self,
        question: str,
        project_id: str,
        context_data: Optional[Dict[str, Any]] = None
    ) -> tuple[str, List[str], TokenUsage]:
        """Answer a user question about the project.
        
        Returns:
            tuple: (answer_text, evidence_list, token_usage)
        """
        
        start_time = time.time()
        
        try:
            # Build context-aware prompt
            context_info = ""
            print(f"[DEBUG] Context data received: {context_data}")
            if context_data:
                if 'project_name' in context_data:
                    context_info += f"\nProject: {context_data['project_name']}"
                if 'project_description' in context_data:
                    context_info += f"\nDescription: {context_data['project_description']}"
                if 'task_count' in context_data:
                    context_info += f"\nTotal Tasks: {context_data['task_count']}"
                if 'completed_tasks' in context_data:
                    context_info += f"\nCompleted Tasks: {context_data['completed_tasks']}"
                if 'completion_percentage' in context_data:
                    context_info += f"\nCompletion: {context_data['completion_percentage']}%"
                if 'status_breakdown' in context_data:
                    context_info += f"\nStatus Breakdown: {context_data['status_breakdown']}"
                if 'priority_breakdown' in context_data:
                    context_info += f"\nPriority Breakdown: {context_data['priority_breakdown']}"
                if 'tasks' in context_data and context_data['tasks']:
                    context_info += f"\n\nTask Details:"
                    for task in context_data['tasks']:
                        context_info += f"\n- {task.get('title', 'Untitled')} (Status: {task.get('status', 'unknown')}, Priority: {task.get('priority', 'unknown')})"
            
            print(f"[DEBUG] Context info built: {context_info}")
            
            prompt = f"""
User Question: {question}

Project Context:{context_info}
Project ID: {project_id}

Please provide a helpful, concise answer to the user's question. If you reference specific information, list your sources as evidence.

Return your response in this JSON format:
{{
  "answer": "your detailed answer here",
  "evidence": ["source 1", "source 2"]
}}
"""
            
            # Make the API call
            response = await self.client.chat.completions.create(
                model=self.config.model,
                messages=[
                    {"role": "system", "content": "You are a helpful project management assistant with access to project data including tasks, status, priorities, and progress. You can view and analyze tasks, provide insights about project progress, and answer questions about specific tasks or overall project status. Be specific and reference actual task data when available."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.max_tokens,
                temperature=0.7,  # Slightly higher for natural conversation
                timeout=self.config.timeout
            )
            
            # Parse the response
            import json
            content = response.choices[0].message.content
            
            try:
                parsed = json.loads(content)
                answer = parsed.get('answer', content)
                evidence = parsed.get('evidence', [])
            except json.JSONDecodeError:
                # If not valid JSON, use the whole response as answer
                answer = content
                evidence = []
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            total_tokens = response.usage.total_tokens
            
            cost = self._calculate_cost(prompt_tokens, completion_tokens)
            
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost=cost
            )
            
            return answer, evidence, token_usage
            
        except Exception as e:
            print(f"OpenAI Q&A error: {e}")
            return f"I'm sorry, I encountered an error while processing your question: {str(e)}", [], TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0
            )
    
    async def generate_insights(
        self,
        prompt: str,
        project_id: str,
        context_data: Optional[Dict[str, Any]] = None
    ) -> tuple[str, TokenUsage]:
        """Generate project assessment insights.
        
        Returns:
            tuple: (insights_json_string, token_usage)
        """
        
        start_time = time.time()
        
        try:
            # Make the API call
            response = await self.client.chat.completions.create(
                model=self.config.model,
                messages=[
                    {"role": "system", "content": "You are a project management expert. Analyze the project data and generate insights as requested. Always return valid JSON in the specified format."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.max_tokens,
                temperature=0.3,  # Lower temperature for more consistent analysis
                timeout=self.config.timeout
            )
            
            # Get the response content
            content = response.choices[0].message.content
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            total_tokens = response.usage.total_tokens
            
            cost = self._calculate_cost(prompt_tokens, completion_tokens)
            
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost=cost
            )
            
            return content, token_usage
            
        except Exception as e:
            print(f"OpenAI insights generation error: {e}")
            return "[]", TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0
            )