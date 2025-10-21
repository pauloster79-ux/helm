# Q&A Setup Guide

## Issue: "Goes blank, then reappears with no answer"

The user is experiencing this issue because the services aren't properly configured. Here's how to fix it:

## Quick Fix Steps

### 1. Start the AI Service
```bash
cd ai-service
python start.py
```

The service should start on `http://localhost:8001`

### 2. Check Environment Variables
Create a `.env` file in the `ai-service` directory:

```bash
# Copy the example file
cp env.example .env
```

Then edit `.env` and add your actual values:

```env
# Required: Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Required: AI Provider API Keys (at least one)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Override defaults
DEFAULT_AI_PROVIDER=openai
DEFAULT_AI_MODEL=gpt-4o-mini
```

### 3. Test the Setup
```bash
cd ai-service
python test_qa.py
```

This will verify:
- Database connection
- API keys
- AI service creation

### 4. Test the Endpoint Directly
```bash
curl -X POST http://localhost:8001/answer-question \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "your-actual-project-id",
    "question": "How many tasks do I have?",
    "user_id": null
  }'
```

## Common Issues & Solutions

### Issue 1: "Database not available"
**Solution**: Set up Supabase environment variables
- Get your Supabase URL and service key from your Supabase dashboard
- Add them to `.env` file

### Issue 2: "API key not configured"
**Solution**: Add at least one AI provider API key
- OpenAI: Get from https://platform.openai.com/api-keys
- Anthropic: Get from https://console.anthropic.com/

### Issue 3: "Project not found"
**Solution**: Use a real project ID
- Check your Supabase database for existing project IDs
- Or create a test project first

### Issue 4: CORS errors in browser
**Solution**: The FastAPI service already has CORS configured for localhost:5173 and localhost:3000

## Expected Flow

1. User types question in AssistantPane
2. Frontend calls `http://localhost:8001/answer-question`
3. FastAPI service fetches project context from Supabase
4. AI service generates answer using OpenAI/Anthropic
5. Question and answer saved to database
6. Response sent back to frontend
7. ActivityFeed refreshes to show Q&A

## Debugging

### Check AI Service Logs
Look at the terminal where you ran `python start.py` for error messages.

### Check Browser Console
Open browser dev tools (F12) and look for:
- Network errors
- JavaScript errors
- Response details

### Test Database Connection
```python
# In ai-service directory
python -c "
from services.database_service import DatabaseService
import asyncio
async def test():
    db = DatabaseService()
    if db.supabase:
        print('✅ Database connected')
    else:
        print('❌ Database not connected - check .env file')
asyncio.run(test())
"
```

## Next Steps After Setup

1. **Test with real project**: Use an actual project ID from your database
2. **Monitor usage**: Check the `ai_usage_logs` table for cost tracking
3. **Customize prompts**: Modify the prompts in `openai_service.py` or `anthropic_service.py` if needed
4. **Add authentication**: The current setup works without auth, but you may want to add it later

## Files Modified for Q&A

- ✅ `ai-service/services/database_service.py` - Added project context methods
- ✅ `ai-service/models.py` - Added QuestionRequest model  
- ✅ `ai-service/main.py` - Added /answer-question endpoint
- ✅ `ai-service/services/validator_service.py` - Added get_ai_config method
- ✅ `frontend/src/components/ai/AssistantPane.tsx` - Updated to call FastAPI directly
- ✅ `frontend/src/types/database.types.ts` - Added Q&A types
- ✅ `frontend/src/components/ai/ActivityCard.tsx` - Already had Q&A display support

