"""
Database service for AI operations.
Handles Supabase interactions for proposals, usage logs, and configurations.
"""

import asyncio
from typing import List, Dict, Any, Optional
from datetime import datetime
from supabase import create_client, Client

from config import get_settings


class DatabaseService:
    """Database service for AI operations."""
    
    def __init__(self):
        self.settings = get_settings()
        
        # Initialize Supabase client (optional for testing)
        if self.settings.supabase_url and self.settings.supabase_service_key:
            self.supabase: Client = create_client(
                self.settings.supabase_url,
                self.settings.supabase_service_key
            )
        else:
            self.supabase = None
            print("Warning: Supabase not configured. Database features disabled.")
    
    async def create_proposal(self, proposal_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new proposal in the database."""
        
        if not self.supabase:
            print("Database not available. Skipping proposal creation.")
            return {}
            
        try:
            result = self.supabase.table("proposals").insert(proposal_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error creating proposal: {e}")
            return {}
    
    async def get_proposals(
        self, 
        project_id: str, 
        status: Optional[str] = None,
        component_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get proposals for a project."""
        
        if not self.supabase:
            print("Database not available. Returning empty proposals list.")
            return []
            
        try:
            query = self.supabase.table("proposals").select("*").eq("project_id", project_id)
            
            if status:
                query = query.eq("status", status)
            
            if component_type:
                query = query.eq("component_type", component_type)
            
            result = query.execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting proposals: {e}")
            return []
    
    async def update_proposal(
        self, 
        proposal_id: str, 
        updates: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update a proposal."""
        
        try:
            result = self.supabase.table("proposals").update(updates).eq("id", proposal_id).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error updating proposal: {e}")
            return {}
    
    async def log_ai_usage(self, usage_data: Dict[str, Any]) -> Dict[str, Any]:
        """Log AI usage to the database."""
        
        try:
            result = self.supabase.table("ai_usage_logs").insert(usage_data).execute()
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error logging AI usage: {e}")
            return {}
    
    async def get_ai_configuration(
        self, 
        project_id: str, 
        component_type: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Get AI configuration for a project."""
        
        try:
            query = self.supabase.table("ai_configurations").select("*").eq("project_id", project_id)
            
            if component_type:
                query = query.eq("component_type", component_type)
            else:
                query = query.is_("component_type", "null")
            
            result = query.single().execute()
            return result.data if result.data else None
        except Exception as e:
            print(f"Error getting AI configuration: {e}")
            return None
    
    async def update_ai_configuration(
        self, 
        project_id: str, 
        config_data: Dict[str, Any],
        component_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update AI configuration for a project."""
        
        try:
            config_data["project_id"] = project_id
            config_data["component_type"] = component_type
            config_data["updated_at"] = datetime.utcnow().isoformat()
            
            result = self.supabase.table("ai_configurations").upsert(
                config_data,
                on_conflict="project_id,component_type"
            ).execute()
            
            return result.data[0] if result.data else {}
        except Exception as e:
            print(f"Error updating AI configuration: {e}")
            return {}
    
    async def get_project_rules(self, project_id: str) -> List[Dict[str, Any]]:
        """Get project-specific rules."""
        
        try:
            # This would typically come from a project_rules table
            # For now, return some default rules
            return [
                {
                    "type": "required_field",
                    "field": "title",
                    "message": "Title is required"
                },
                {
                    "type": "max_length",
                    "field": "description",
                    "value": 5000,
                    "message": "Description must be less than 5000 characters"
                }
            ]
        except Exception as e:
            print(f"Error getting project rules: {e}")
            return []
    
    async def get_related_components(
        self, 
        project_id: str, 
        component_type: str,
        component_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get related components for context."""
        
        try:
            # This would typically query the appropriate table based on component_type
            # For now, return empty list
            return []
        except Exception as e:
            print(f"Error getting related components: {e}")
            return []
    
    async def get_usage_stats(
        self, 
        project_id: str, 
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get AI usage statistics for a project."""
        
        try:
            query = self.supabase.table("ai_usage_logs").select("*").eq("project_id", project_id)
            
            if start_date:
                query = query.gte("timestamp", start_date.isoformat())
            
            if end_date:
                query = query.lte("timestamp", end_date.isoformat())
            
            result = query.execute()
            usage_logs = result.data or []
            
            # Calculate stats
            total_tokens = sum(log.get("tokens_used", 0) for log in usage_logs)
            total_cost = sum(log.get("estimated_cost", 0) for log in usage_logs)
            
            return {
                "total_requests": len(usage_logs),
                "total_tokens": total_tokens,
                "total_cost": total_cost,
                "usage_logs": usage_logs
            }
        except Exception as e:
            print(f"Error getting usage stats: {e}")
            return {
                "total_requests": 0,
                "total_tokens": 0,
                "total_cost": 0.0,
                "usage_logs": []
            }
    
    async def get_project_details(self, project_id: str) -> Optional[Dict[str, Any]]:
        """Get project details."""
        
        if not self.supabase:
            print("Database not available. Returning None.")
            return None
            
        try:
            result = self.supabase.table("projects").select("*").eq("id", project_id).single().execute()
            return result.data if result.data else None
        except Exception as e:
            print(f"Error getting project details: {e}")
            return None
    
    async def get_project_tasks(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all tasks for a project."""
        
        if not self.supabase:
            print("Database not available. Returning empty task list.")
            return []
            
        try:
            result = self.supabase.table("tasks").select(
                "id, title, description, status, priority, progress_percentage, "
                "estimated_hours, start_date, end_date, due_date, completed_at, "
                "parent_task_id, owner_id, created_at, updated_at"
            ).eq("project_id", project_id).is_("deleted_at", "null").execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting project tasks: {e}")
            return []
    
    async def get_task_dependencies(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all task dependencies for a project."""
        
        if not self.supabase:
            print("Database not available. Returning empty dependencies list.")
            return []
            
        try:
            # First get all task IDs for this project
            tasks_result = self.supabase.table("tasks").select("id").eq("project_id", project_id).execute()
            task_ids = [task["id"] for task in (tasks_result.data or [])]
            
            if not task_ids:
                return []
            
            # Get dependencies for these tasks
            result = self.supabase.table("task_dependencies").select(
                "id, task_id, depends_on_task_id, dependency_type"
            ).in_("task_id", task_ids).execute()
            return result.data or []
        except Exception as e:
            print(f"Error getting task dependencies: {e}")
            return []
    
    async def get_project_context(self, project_id: str) -> Dict[str, Any]:
        """Get comprehensive project context for AI analysis."""
        
        # Fetch all data in parallel
        project_details, tasks, dependencies = await asyncio.gather(
            self.get_project_details(project_id),
            self.get_project_tasks(project_id),
            self.get_task_dependencies(project_id)
        )
        
        # Calculate statistics
        status_breakdown = {}
        priority_breakdown = {}
        total_estimated_hours = 0
        completed_tasks = 0
        
        for task in tasks:
            # Status breakdown
            status = task.get("status", "unknown")
            status_breakdown[status] = status_breakdown.get(status, 0) + 1
            
            # Priority breakdown
            priority = task.get("priority", "unknown")
            priority_breakdown[priority] = priority_breakdown.get(priority, 0) + 1
            
            # Estimated hours
            if task.get("estimated_hours"):
                total_estimated_hours += task["estimated_hours"]
            
            # Completed count
            if task.get("status") == "done":
                completed_tasks += 1
        
        # Calculate completion percentage
        completion_percentage = (completed_tasks / len(tasks) * 100) if tasks else 0
        
        return {
            "project": project_details,
            "tasks": tasks,
            "dependencies": dependencies,
            "stats": {
                "total_tasks": len(tasks),
                "status_breakdown": status_breakdown,
                "priority_breakdown": priority_breakdown,
                "total_estimated_hours": total_estimated_hours,
                "completed_tasks": completed_tasks,
                "completion_percentage": round(completion_percentage, 1),
                "total_dependencies": len(dependencies)
            }
        }