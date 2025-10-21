# Helm AI Service

FastAPI service for AI-powered project management validation and proposal generation.

## Features

- **Multi-Provider AI Support**: OpenAI GPT-4o and Anthropic Claude 3
- **Real-time Validation**: Field-level and component-level validation
- **Proposal Generation**: AI-generated improvement suggestions
- **Cost Tracking**: Token usage and cost calculation
- **Database Integration**: Supabase for proposals and usage logs
- **Configurable**: Per-project AI settings and validation scope

## Quick Start

### 1. Install Dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 2. Set Environment Variables

Copy the example environment file and configure:

```bash
cp env.example .env
```

Edit `.env` with your API keys:

```env
# Required: At least one AI provider
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required: Supabase configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 3. Start the Service

```bash
python start.py
```

The service will start on `http://localhost:8001`

### 4. Test the Service

```bash
python test_service.py
```

## API Endpoints

### Health Check
```
GET /health
```

### Validate Component
```
POST /validate
```

Request body:
```json
{
  "project_id": "project-123",
  "component_type": "task",
  "component_data": {
    "title": "Implement user authentication",
    "description": "Add login functionality",
    "status": "todo"
  },
  "validation_scope": "selective",
  "ai_provider": "openai",
  "ai_model": "gpt-4o-mini"
}
```

### Get Proposals
```
GET /proposals/{project_id}
```

### Handle Proposal Action
```
POST /proposals/{proposal_id}/action
```

### Get AI Configuration
```
GET /config/{project_id}
```

### Update AI Configuration
```
PUT /config/{project_id}
```

### Get Usage Statistics
```
GET /usage/{project_id}
```

## API Documentation

Once the service is running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## Configuration

### AI Providers

The service supports multiple AI providers:

- **OpenAI**: GPT-4o, GPT-4o-mini
- **Anthropic**: Claude 3 Sonnet, Claude 3 Haiku

### Validation Scopes

- **rules_only**: Basic rule validation only
- **selective**: Quality and improvement suggestions
- **full**: Comprehensive validation with best practices

### Cost Tracking

The service automatically tracks:
- Token usage per request
- Estimated costs per provider/model
- Daily and monthly usage limits
- Cost alerts and thresholds

## Development

### Project Structure

```
ai-service/
├── main.py                 # FastAPI application
├── config.py              # Configuration management
├── models.py              # Pydantic models
├── services/
│   ├── base_ai_service.py # Base AI service class
│   ├── openai_service.py  # OpenAI implementation
│   ├── anthropic_service.py # Anthropic implementation
│   ├── ai_service_factory.py # Service factory
│   ├── validator_service.py # Main validation logic
│   └── database_service.py # Database operations
├── requirements.txt       # Python dependencies
├── start.py              # Startup script
├── test_service.py       # Test script
└── README.md            # This file
```

### Adding New AI Providers

1. Create a new service class inheriting from `BaseAIService`
2. Implement the required methods
3. Add the provider to `AIServiceFactory`
4. Update configuration and models as needed

### Testing

Run the test script to verify everything works:

```bash
python test_service.py
```

This will:
- Test AI provider connections
- Run a sample validation
- Display results and costs

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8001

CMD ["python", "start.py"]
```

### Environment Variables

All configuration is done through environment variables. See `env.example` for the complete list.

## Integration

The AI service is designed to integrate with:

1. **Frontend**: React components for real-time validation
2. **Backend**: NestJS API for proposal management
3. **Database**: Supabase for data persistence

### Frontend Integration

```typescript
// Example validation request
const response = await fetch('http://localhost:8001/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    project_id: 'project-123',
    component_type: 'task',
    component_data: taskData,
    validation_scope: 'selective',
    ai_provider: 'openai',
    ai_model: 'gpt-4o-mini'
  })
});
```

## Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your OpenAI/Anthropic API keys are valid
2. **Supabase Connection**: Check your Supabase URL and service key
3. **Import Errors**: Make sure all dependencies are installed
4. **Port Conflicts**: Change the port in `.env` if 8001 is in use

### Logs

The service logs important information to the console. Check for:
- Connection status
- Validation errors
- Cost calculations
- Database operations

## License

Part of the Helm project management platform.

