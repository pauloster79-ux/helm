# 🤖 AI Integration Setup Guide

## 🔒 **Why API Keys Don't Go in Frontend**

### Security Issues:
- **Public Exposure**: Frontend code is visible to anyone
- **Browser DevTools**: Users can inspect and steal API keys
- **No Rate Limiting**: Users could abuse your API quota
- **No Access Control**: Anyone could use your keys

### Proper Architecture:
```
Frontend (React) → Backend (NestJS) → AI Service (FastAPI) → OpenAI/Anthropic
     ↑                    ↑                    ↑
   No API Keys        API Keys Here        API Keys Here
```

## 🏗️ **Complete Setup**

### 1. **Backend Setup (NestJS)**
```bash
# Install dependencies
cd backend
npm install @nestjs/axios @nestjs/config

# Create .env file
cp .env.example .env
# Edit .env with your Supabase and JWT secrets
```

### 2. **AI Service Setup (FastAPI)**
```bash
# Install dependencies
cd ai-service
pip install -r requirements.txt

# Create .env file
cp env.example .env
# Edit .env with your OpenAI/Anthropic API keys
```

### 3. **Environment Variables**

#### Backend (.env):
```env
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
AI_SERVICE_URL=http://localhost:8001
CORS_ORIGIN=http://localhost:5173
```

#### AI Service (.env):
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
API_HOST=0.0.0.0
API_PORT=8001
API_DEBUG=true
```

## 🚀 **Running the System**

### Start all services:
```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run start:dev

# Terminal 3: AI Service
cd ai-service && python start.py
```

### Test the integration:
1. Go to `http://localhost:5173/ai-test`
2. Type in the form fields
3. See real AI suggestions appear!

## 🔐 **Security Benefits**

### With Backend Proxy:
- ✅ API keys are server-side only
- ✅ User authentication required
- ✅ Rate limiting per user
- ✅ Cost tracking per project
- ✅ Audit logging
- ✅ Access control

### Without Backend (Direct Frontend):
- ❌ API keys exposed to users
- ❌ No authentication
- ❌ No rate limiting
- ❌ No cost control
- ❌ Security vulnerability

## 📊 **Data Flow**

1. **User types** in frontend form
2. **Frontend sends** request to `/api/ai/validate`
3. **Backend authenticates** user and validates request
4. **Backend calls** AI service with API keys
5. **AI service** processes with OpenAI/Anthropic
6. **Response flows back** through the chain
7. **Usage is logged** for cost tracking

## 🎯 **Next Steps**

1. Set up your API keys in the AI service `.env`
2. Configure your backend `.env` with Supabase
3. Start all three services
4. Test the AI features!

The frontend will now securely use AI through your backend, keeping API keys safe and providing proper user authentication and rate limiting.

