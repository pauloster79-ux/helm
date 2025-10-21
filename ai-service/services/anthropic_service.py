"""
Anthropic service for AI operations.
Handles API calls, token counting, and cost calculation.
"""

import asyncio
import time
from typing import List, Dict, Any, Optional
import anthropic
from anthropic import AsyncAnthropic

from config import get_settings
from models import TokenUsage, AIProviderConfig, ValidationContext, AIProposal, ValidationIssue
from .base_ai_service import BaseAIService


class AnthropicService(BaseAIService):
    """Anthropic service implementation."""
    
    def __init__(self, config: AIProviderConfig):
        super().__init__(config)
        self.client = AsyncAnthropic(api_key=config.api_key)
        self.settings = get_settings()
    
    async def validate_component(
        self, 
        context: ValidationContext,
        validation_scope: str = "selective"
    ) -> tuple[List[ValidationIssue], List[AIProposal], TokenUsage]:
        """Validate a component using Anthropic."""
        
        start_time = time.time()
        
        try:
            # Build the prompt based on validation scope
            prompt = self._build_validation_prompt(context, validation_scope)
            
            # Make the API call
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
                timeout=self.config.timeout,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse the response
            content = response.content[0].text
            issues, proposals = self._parse_validation_response(content, context)
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.input_tokens
            completion_tokens = response.usage.output_tokens
            total_tokens = prompt_tokens + completion_tokens
            
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
            print(f"Anthropic validation error: {e}")
            return [], [], TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0
            )
    
    def _build_validation_prompt(self, context: ValidationContext, validation_scope: str) -> str:
        """Build the validation prompt based on context and scope."""
        
        system_prompt = self._get_system_prompt()
        
        base_prompt = f"""
{system_prompt}

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
        """Get the system prompt for Anthropic."""
        return """
You're helping someone write better task titles and descriptions. Give them friendly, natural feedback.

Check these things:
1. **Task Title Quality**: Is it clear, professional, and actionable?
2. **Task Description Quality**: Is it clear what needs to be done?
3. **Title-Description Consistency**: Do the title and description actually match? If the title says "Run a race" but the description talks about "Buy a cat", that doesn't make sense!

CRITICAL: When both title and description exist but don't match, flag this as a "title-description mismatch" issue, NOT a missing title issue.

For example:
- "build" → "This is a good action verb! You might want to add what you're building, like 'build user dashboard' or 'build API integration'"
- "love" → "This seems like personal content rather than a work task. Maybe try something like 'review user feedback' or 'design new feature'?"
- Title: "Run a race" + Description: "Buy a cat" → Flag as title-description mismatch, not missing title!

Be helpful and encouraging, not critical or rigid.

Return your feedback in this JSON format:
{
  "issues": [{"field": "title", "issue_type": "suggestion", "message": "your friendly feedback here", "severity": "info", "suggestion": "specific alternative"}],
  "proposals": []
}

CRITICAL RULE: ONLY CREATE PROPOSALS FOR COMPLETE, READY-TO-USE ALTERNATIVES

**Issues** = Guidance and advice (use this 99% of the time)
**Proposals** = Complete, usable alternatives (use this 1% of the time)

NEVER create proposals when:
- You would use placeholders like "[Add criterion]", "[specify details]", etc.
- The user needs to fill in specific information you don't know
- You're suggesting format improvements but can't write the complete replacement
- The text is vague but you don't know the specific context/details

ONLY create proposals when:
- You can write a COMPLETE, ready-to-use replacement
- You know all the specific details needed
- The alternative is immediately actionable without any user input

DEFAULT TO ISSUES: When in doubt, provide guidance in "issues" and leave "proposals" empty.

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

Example for "fall in love":
{
  "issues": [
    {
      "field": "title",
      "issue_type": "invalid_format",
      "message": "Task title 'fall in love' fails validation. No clear action verb, too vague, no deliverable, can't verify completion.",
      "severity": "error",
      "suggestion": "Use specific action verbs and clear outcomes. Try: 'Review and approve new brand identity', 'Evaluate design concepts for homepage', or 'Test user experience for onboarding flow'"
    }
  ],
  "proposals": []
}

Example for missing acceptance criteria (guidance only):
{
  "issues": [
    {
      "field": "description",
      "issue_type": "incomplete",
      "message": "The description could benefit from acceptance criteria to clarify when the task is complete.",
      "severity": "info",
      "suggestion": "Add 2-3 specific criteria that define when this task is done, such as 'All tests passing' or 'Approved by team lead'"
    }
  ],
  "proposals": []
}

WRONG - Don't do this:
{
  "proposals": [
    {
      "changes": {"description": "Build a garden shed\n\nAcceptance Criteria:\n1. [Add criterion]\n2. [Add criterion]"}
    }
  ]
}

RIGHT - Do this instead:
{
  "issues": [
    {
      "field": "description",
      "issue_type": "incomplete",
      "message": "Consider adding acceptance criteria to clarify when this task is complete.",
      "severity": "info",
      "suggestion": "Add specific criteria like 'Shed is structurally sound' or 'All materials purchased'"
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
        """Parse the Anthropic response into structured data."""
        
        print(f"[DEBUG] Raw AI response: {content[:500]}...")  # Debug log
        
        try:
            import json
            import re
            
            # Extract JSON from response (handle cases where AI adds extra text)
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                json_content = json_match.group(0)
            else:
                json_content = content
                
            data = json.loads(json_content)
            
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
            print(f"Error parsing Anthropic response: {e}")
            print(f"Content that failed to parse: {content}")
            
            # Try to extract issues and proposals from non-JSON response
            issues = []
            proposals = []
            
            # Look for common patterns in the response
            if "error" in content.lower() or "invalid" in content.lower():
                # Create a basic issue if the AI mentioned errors
                issues.append(ValidationIssue(
                    field="general",
                    issue_type="validation_error",
                    message="AI detected validation issues but response format was invalid",
                    severity="warning"
                ))
            
            return issues, proposals
    
    def _calculate_cost(self, prompt_tokens: int, completion_tokens: int) -> float:
        """Calculate the cost based on token usage."""
        
        # Get cost per 1k tokens based on model
        if "haiku" in self.config.model.lower():
            cost_per_1k = self.settings.anthropic_claude_3_haiku_cost_per_1k_tokens
        elif "sonnet" in self.config.model.lower():
            cost_per_1k = self.settings.anthropic_claude_3_sonnet_cost_per_1k_tokens
        else:
            # Default to Haiku pricing
            cost_per_1k = self.settings.anthropic_claude_3_haiku_cost_per_1k_tokens
        
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
        """Test the Anthropic API connection."""
        try:
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=5,
                timeout=10,
                messages=[{"role": "user", "content": "Hello"}]
            )
            return response.content[0].text is not None
        except Exception as e:
            print(f"Anthropic connection test failed: {e}")
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
            if context_data:
                if 'project_name' in context_data:
                    context_info += f"\nProject: {context_data['project_name']}"
                if 'project_description' in context_data:
                    context_info += f"\nDescription: {context_data['project_description']}"
                if 'task_count' in context_data:
                    context_info += f"\nTasks: {context_data['task_count']}"
            
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
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                temperature=0.7,  # Slightly higher for natural conversation
                timeout=self.config.timeout,
                system="You are a helpful project management assistant. Provide clear, actionable answers to user questions about their projects.",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Parse the response
            import json
            content = response.content[0].text
            
            try:
                parsed = json.loads(content)
                answer = parsed.get('answer', content)
                evidence = parsed.get('evidence', [])
            except json.JSONDecodeError:
                # If not valid JSON, use the whole response as answer
                answer = content
                evidence = []
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.input_tokens
            completion_tokens = response.usage.output_tokens
            total_tokens = prompt_tokens + completion_tokens
            
            cost = self._calculate_cost(prompt_tokens, completion_tokens)
            
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost=cost
            )
            
            return answer, evidence, token_usage
            
        except Exception as e:
            print(f"Anthropic Q&A error: {e}")
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
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                temperature=0.3,  # Lower temperature for more consistent analysis
                messages=[
                    {"role": "user", "content": f"You are a project management expert. Analyze the project data and generate insights as requested. Always return valid JSON in the specified format.\n\n{prompt}"}
                ]
            )
            
            # Get the response content
            content = response.content[0].text
            
            # Calculate token usage and cost
            prompt_tokens = response.usage.input_tokens
            completion_tokens = response.usage.output_tokens
            total_tokens = prompt_tokens + completion_tokens
            
            cost = self._calculate_cost(prompt_tokens, completion_tokens)
            
            token_usage = TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens,
                estimated_cost=cost
            )
            
            return content, token_usage
            
        except Exception as e:
            print(f"Anthropic insights generation error: {e}")
            return "[]", TokenUsage(
                prompt_tokens=0,
                completion_tokens=0,
                total_tokens=0,
                estimated_cost=0.0
            )