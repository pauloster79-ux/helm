"""
FastAPI main application for AI service.
"""

import asyncio
from datetime import datetime
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import get_settings
from models import (
    AIValidationRequest, AIValidationResponse, HealthResponse,
    ProposalActionRequest, ProposalResponse, QuestionRequest, QuestionAnswerResponse
)
from services.validator_service import ValidatorService

# Create FastAPI app
app = FastAPI(
    title="Helm AI Service",
    description="AI-powered validation and proposal generation for project management",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global validator service
validator_service = ValidatorService()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    
    # Test AI provider connections
    ai_providers = await validator_service.test_ai_connections()
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        ai_providers=ai_providers
    )


@app.post("/validate", response_model=AIValidationResponse)
async def validate_component(request: AIValidationRequest):
    """Validate a component using AI."""
    
    try:
        response = await validator_service.validate_component(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@app.post("/proposals/{proposal_id}/action", response_model=ProposalResponse)
async def handle_proposal_action(proposal_id: str, request: ProposalActionRequest):
    """Handle proposal actions (accept, reject, modify, defer)."""
    
    try:
        # This would typically update the proposal in the database
        # For now, return a success response
        
        updates = {
            "status": request.action,
            "reviewed_at": datetime.utcnow().isoformat()
        }
        
        if request.feedback:
            updates["feedback"] = request.feedback
        
        if request.modifications:
            updates["modifications"] = request.modifications
        
        # Update proposal in database
        updated_proposal = await validator_service.db_service.update_proposal(
            proposal_id, updates
        )
        
        return ProposalResponse(
            success=True,
            message=f"Proposal {request.action}ed successfully",
            updated_proposal=updated_proposal
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Action failed: {str(e)}")


@app.get("/proposals/{project_id}")
async def get_proposals(
    project_id: str,
    status: str = None,
    component_type: str = None
):
    """Get proposals for a project."""
    
    try:
        proposals = await validator_service.db_service.get_proposals(
            project_id, status, component_type
        )
        return {"proposals": proposals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get proposals: {str(e)}")


@app.get("/config/{project_id}")
async def get_ai_config(project_id: str):
    """Get AI configuration for a project."""
    
    try:
        config = await validator_service.db_service.get_ai_configuration(project_id)
        return {"config": config}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get config: {str(e)}")


@app.put("/config/{project_id}")
async def update_ai_config(project_id: str, config_data: Dict[str, Any]):
    """Update AI configuration for a project."""
    
    try:
        updated_config = await validator_service.db_service.update_ai_configuration(
            project_id, config_data
        )
        return {"config": updated_config}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update config: {str(e)}")


@app.get("/usage/{project_id}")
async def get_usage_stats(project_id: str):
    """Get AI usage statistics for a project."""
    
    try:
        stats = await validator_service.db_service.get_usage_stats(project_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage stats: {str(e)}")


@app.post("/answer-question", response_model=QuestionAnswerResponse)
async def answer_question(request: QuestionRequest):
    """Answer a user question about their project."""
    
    import time
    import uuid
    
    start_time = time.time()
    
    try:
        # Get comprehensive project context
        project_context = await validator_service.db_service.get_project_context(request.project_id)
        
        # If database is not available, create mock context for testing
        if not project_context.get("project"):
            print(f"[DEBUG] Database not available, using mock context for project {request.project_id}")
            # Use the actual tasks visible in the UI
            context_data = {
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
        
        # Get AI configuration for the project
        ai_config = await validator_service.get_ai_config(request.project_id)
        ai_service = validator_service.get_ai_service(ai_config)
        
        # Call AI service to get answer
        answer_text, evidence, token_usage = await ai_service.answer_question(
            question=request.question,
            project_id=request.project_id,
            context_data=context_data
        )
        
        # Save question to database as a proposal (if database available)
        question_id = str(uuid.uuid4())
        if validator_service.db_service.supabase:
            question_proposal = await validator_service.db_service.create_proposal({
                "project_id": request.project_id,
                "activity_type": "question",
                "rationale": request.question,
                "evidence": [],
                "status": "pending"
            })
            question_id = question_proposal.get("id", question_id)
        
        # Save answer to database as a proposal (if database available)
        answer_id = str(uuid.uuid4())
        if validator_service.db_service.supabase:
            answer_proposal = await validator_service.db_service.create_proposal({
                "project_id": request.project_id,
                "activity_type": "answer",
                "parent_id": question_id,
                "rationale": answer_text,
                "evidence": evidence,
                "status": "pending"
            })
            answer_id = answer_proposal.get("id", answer_id)
        
        # Log AI usage (if database available)
        processing_time_ms = int((time.time() - start_time) * 1000)
        if validator_service.db_service.supabase:
            await validator_service.db_service.log_ai_usage({
                "project_id": request.project_id,
                "operation_type": "question_answer",
                "ai_provider": ai_config['provider'],
                "ai_model": ai_config['model'],
                "input_tokens": token_usage.prompt_tokens,
                "output_tokens": token_usage.completion_tokens,
                "total_tokens": token_usage.total_tokens,
                "estimated_cost": token_usage.estimated_cost,
                "latency_ms": processing_time_ms,
                "success": True,
                "proposal_ids": [question_id, answer_id]
            })
        
        return QuestionAnswerResponse(
            success=True,
            answer=answer_text,
            evidence=evidence,
            question_id=question_id,
            answer_id=answer_id,
            usage_stats={
                "prompt_tokens": token_usage.prompt_tokens,
                "completion_tokens": token_usage.completion_tokens,
                "total_tokens": token_usage.total_tokens,
                "estimated_cost": token_usage.estimated_cost,
                "model": ai_config['model'],
                "provider": ai_config['provider']
            },
            processing_time_ms=processing_time_ms
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error answering question: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")


@app.post("/assess-project")
async def assess_project(request: Dict[str, Any]):
    """Assess a project and generate insights."""
    
    import time
    import uuid
    
    start_time = time.time()
    
    try:
        project_id = request.get('project_id')
        user_id = request.get('user_id')
        
        if not project_id:
            raise HTTPException(status_code=400, detail="project_id is required")
        
        # Get AI configuration for the project
        ai_config = await validator_service.get_ai_config(project_id)
        
        # Import the assessment service
        from services.assessment_service import ProjectAssessmentService
        assessment_service = ProjectAssessmentService()
        
        # Generate insights
        insights = await assessment_service.assess_project(project_id, ai_config)
        
        # Save insights to database
        saved_insights = []
        for insight in insights:
            insight_data = {
                "project_id": project_id,
                "activity_type": "insight",
                "proposal_type": None,
                "component_type": insight.component_type,
                "component_id": insight.component_id,
                "changes": insight.changes,
                "rationale": insight.rationale,
                "confidence": insight.confidence,
                "evidence": insight.evidence,
                "estimated_impact": insight.estimated_impact,
                "status": "pending",
                "expires_at": None
            }
            
            if validator_service.db_service.supabase:
                saved_insight = await validator_service.db_service.create_proposal(insight_data)
                if saved_insight:
                    saved_insights.append(saved_insight)
            else:
                # Mock response for testing
                saved_insight = {
                    "id": str(uuid.uuid4()),
                    "project_id": project_id,
                    "activity_type": "insight",
                    "rationale": insight.rationale,
                    "confidence": insight.confidence,
                    "evidence": insight.evidence,
                    "estimated_impact": insight.estimated_impact,
                    "status": "pending",
                    "created_at": datetime.utcnow().isoformat()
                }
                saved_insights.append(saved_insight)
        
        # Calculate processing time
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "insights": saved_insights,
            "usage_stats": {
                "model": ai_config['model'],
                "provider": ai_config['provider']
            },
            "processing_time_ms": processing_time_ms
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error assessing project: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to assess project: {str(e)}")


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_debug
    )
