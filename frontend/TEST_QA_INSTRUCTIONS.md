# Q&A Testing Instructions

## Issue: "When I put a question in it does nothing"

### Debugging Steps

1. **Open Browser Developer Tools** (F12)

2. **Go to Console Tab**

3. **Type a question** in the Assistant Pane

4. **Look for console logs** - you should see:
   ```
   [AssistantPane] handleSendMessage called
   [AssistantPane] Sending question: your question here
   [AssistantPane] Response status: 200
   [AssistantPane] Answer received: {...}
   ```

### What to Check

#### If you see NO console logs at all:
- The button click isn't firing
- Check if the Assistant Pane is actually visible (not collapsed)
- Check if you're on a page that has the Assistant Pane

#### If you see "No project selected":
- You need to navigate to a project first
- Go to `/projects` and select a project
- Or go to `/projects/{project-id}/overview`

#### If you see "Early return - no message or already sending":
- The message is empty or already sending
- Try typing a longer message

#### If you see "Response status: 200" but no answer:
- Check the Network tab for the `/answer-question` request
- Look at the response body
- The answer might be there but not displaying

#### If you see an error:
- Check the error message in the console
- Common issues:
  - AI service not running (should be on port 8001)
  - CORS error (should be configured)
  - Network error (check if localhost:8001 is accessible)

### Quick Test

1. **Make sure AI service is running:**
   ```bash
   cd ai-service
   python start.py
   ```

2. **Test the endpoint directly:**
   ```bash
   # In PowerShell:
   $body = @{project_id="test-123"; question="How many tasks?"; user_id=$null} | ConvertTo-Json
   Invoke-WebRequest -Uri "http://localhost:8001/answer-question" -Method POST -Body $body -ContentType "application/json"
   ```

3. **If that works, the issue is in the frontend**

### Frontend Debugging

Check the browser console for:
- `[AssistantPane]` logs
- Any errors (red text)
- Network tab for failed requests

### Common Issues

1. **No projectId**: Navigate to a project page
2. **AI service not running**: Start it with `python start.py`
3. **CORS error**: Already configured in FastAPI
4. **Wrong URL**: Should be `http://localhost:8001/answer-question`

### Expected Behavior

When you type a question and press Enter or click Send:
1. Input clears immediately
2. Console shows "[AssistantPane] Sending question: ..."
3. Console shows "[AssistantPane] Response status: 200"
4. Console shows "[AssistantPane] Answer received: {...}"
5. Activity feed refreshes
6. Question appears in blue card
7. Answer appears in green card

### Still Not Working?

Check:
1. Are you on a page with AssistantPane? (MainLayout or AITestPage)
2. Is the Assistant Pane visible (not collapsed)?
3. Do you have a project selected?
4. Is the AI service running on port 8001?
5. Check browser console for errors
6. Check Network tab for failed requests


