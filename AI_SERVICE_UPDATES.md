# AI Service Updates - Activity Type Support

## Overview
Updated the AI service (FastAPI/Python) to support generating different activity types: proposals, insights, and Q&A answers.

## Files Modified

### 1. `ai-service/models.py` ✅

**Added:**
- `ActivityType` enum with values: `PROPOSAL`, `INSIGHT`, `QUESTION`, `ANSWER`
- `QuestionAnswerRequest` model for Q&A requests
- `QuestionAnswerResponse` model for Q&A responses

**Updated:**
- `AIProposal` model to include:
  - `activity_type` field (defaults to 'proposal')
  - Made `proposal_type`, `component_type`, `changes`, `confidence` optional (not needed for insights/Q&A)
  - Added `parent_id` field for linking answers to questions
  - Updated `rationale` field description to cover all activity types

### 2. `ai-service/services/base_ai_service.py` ✅

**Added:**
- `answer_question()` abstract method that all AI services must implement
  - Parameters: `question`, `project_id`, `context_data`
  - Returns: `(answer_text, evidence_list, token_usage)`

### 3. `ai-service/services/openai_service.py` ✅

**Added:**
- `answer_question()` implementation for OpenAI
  - Builds context-aware prompt with project information
  - Uses temperature of 0.7 for more natural conversation
  - Parses JSON response with answer and evidence
  - Falls back to plain text if JSON parsing fails
  - Calculates token usage and cost

**Updated:**
- System prompt to distinguish between proposals and insights:
  - **Proposals**: Actionable with complete alternatives
  - **Insights**: Non-actionable observations about patterns/best practices
  - Guidance on when to generate each type

### 4. `ai-service/services/anthropic_service.py` ✅

**Added:**
- `answer_question()` implementation for Anthropic Claude
  - Same functionality as OpenAI version
  - Uses Anthropic's system message format
  - Handles Claude-specific response structure

## New Functionality

### Q&A Support
The AI service can now answer user questions about their projects:

```python
# Request
{
  "project_id": "uuid",
  "question_id": "uuid",
  "question": "What tasks are blocking progress?",
  "ai_provider": "openai",
  "ai_model": "gpt-4o-mini",
  "context_data": {
    "project_name": "My Project",
    "project_description": "...",
    "task_count": 15
  }
}

# Response
{
  "success": true,
  "answer": "Based on your project, tasks T-12 and T-15 are blocking...",
  "evidence": ["Task T-12 has 3 dependencies", "T-15 is high priority"],
  "usage_stats": {...},
  "processing_time_ms": 2340
}
```

### Insight Generation
The AI can now generate non-actionable insights:

```python
# Example insight in proposals list
{
  "activity_type": "insight",
  "rationale": "Pattern detected: 5 tasks are missing acceptance criteria. Consider adding clear success criteria to improve task clarity.",
  "evidence": ["Tasks T-1, T-3, T-7, T-9, T-12 lack acceptance criteria"],
  "component_type": null,
  "proposal_type": null,
  "changes": null,
  "confidence": null
}
```

### Proposal Enhancement
Proposals now explicitly include `activity_type`:

```python
# Example proposal
{
  "activity_type": "proposal",
  "proposal_type": "field_improvement",
  "component_type": "task",
  "component_id": "task-uuid",
  "changes": {
    "field": "title",
    "current_value": "fix bug",
    "proposed_value": "Fix authentication timeout in SSO login"
  },
  "rationale": "Title should be specific...",
  "confidence": "high",
  "evidence": ["Best practice: specific titles"]
}
```

## Integration with Frontend

### Q&A Flow
1. User types question in Assistant Pane
2. Frontend saves question to database (`activity_type: 'question'`)
3. Frontend calls AI service endpoint: `POST /api/ai/answer`
4. AI service processes question and returns answer
5. Frontend saves answer to database (`activity_type: 'answer'`, `parent_id: question_id`)
6. Both question and answer appear in activity feed

### Insight Generation (Future)
1. During validation, AI decides whether to generate proposal or insight
2. If insight: Set `activity_type: 'insight'`, omit `changes` and `proposal_type`
3. Frontend displays insights with different styling (yellow, no action buttons)
4. Users can dismiss insights but cannot defer them

## API Endpoints to Create (FastAPI)

### Q&A Endpoint
```python
@app.post("/api/ai/answer")
async def answer_question(request: QuestionAnswerRequest):
    """Answer a user question about their project."""
    service = AIServiceFactory.create_service(
        provider=request.ai_provider,
        model=request.ai_model,
        api_key=get_api_key(request.ai_provider)
    )
    
    answer, evidence, token_usage = await service.answer_question(
        question=request.question,
        project_id=request.project_id,
        context_data=request.context_data
    )
    
    return QuestionAnswerResponse(
        success=True,
        answer=answer,
        evidence=evidence,
        usage_stats=token_usage.dict(),
        processing_time_ms=...
    )
```

### Enhanced Validation
The existing validation endpoint can now return insights in addition to proposals. No API changes needed - just updated response structure.

## Backwards Compatibility

✅ **Fully Backwards Compatible**
- Existing proposals continue to work unchanged
- `activity_type` defaults to 'proposal' if not specified
- Optional fields allow gradual migration
- No breaking changes to existing API contracts

## Testing

### Unit Tests Needed
1. Test `answer_question()` for both OpenAI and Anthropic
2. Test insight generation in validation responses
3. Test ActivityType enum values
4. Test optional fields in AIProposal model

### Integration Tests Needed
1. End-to-end Q&A flow (question → answer)
2. Insight display in frontend
3. Mixed proposals and insights in activity feed
4. Token usage and cost tracking for Q&A

## Cost Implications

### Q&A Costs
- Similar to validation requests
- Temperature set slightly higher (0.7 vs 0.1) for natural responses
- Estimated: $0.0001-0.0005 per question for GPT-4o-mini
- Should track separately from validation costs

### Insight Generation
- No additional cost - generated during existing validation calls
- AI decides whether to return proposal or insight based on situation
- Can configure threshold for insight generation in AI config

## Configuration

### AI Configuration Updates Needed
Add insight generation settings to `ai_configurations` table:
- `enable_insights` (boolean)
- `insight_threshold` (low/medium/high)
- `insight_frequency` (realtime/daily/weekly)

## Next Steps

1. **Create FastAPI endpoint** for Q&A (`POST /api/ai/answer`)
2. **Update validation endpoint** to handle insight responses
3. **Add logging** for Q&A operations
4. **Add cost tracking** for Q&A in `ai_usage_logs` table
5. **Update frontend** to call AI service for answers
6. **Test end-to-end** Q&A flow

## Documentation Updates

- Update API documentation with new endpoints
- Add examples of insights in developer docs
- Document when AI chooses proposal vs insight
- Add Q&A examples to user guide

## Summary

All AI service code is now ready to support:
- ✅ Actionable proposals (existing)
- ✅ Non-actionable insights (new)
- ✅ Q&A interactions (new)

The frontend already has the UI components and data structures. Once the FastAPI endpoints are created, the full activity feed will be functional!

