# 🚀 Quick Start Guide

Get CodeBuddy up and running in minutes! This guide will have you chatting with your code and generating diagrams in no time.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Docker & Docker Compose** (recommended) or
- **Node.js 18+** and **Python 3.9+** for local development
- **GitHub account** for repository integration
- **Git** for cloning the repository

## ⚡ Option 1: Docker Setup (Recommended)

The fastest way to get started with CodeBuddy.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodeBuddy
```

### 2. Quick Start with Docker

```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access CodeBuddy

Once the containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Health Check

Verify everything is running:

```bash
# Check all services
curl http://localhost:8000/health

# Check specific components
curl http://localhost:8000/chat/health
curl http://localhost:8000/diagram/health
curl http://localhost:8000/tools/health
```

## 🛠️ Option 2: Local Development Setup

For development and customization.

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start the development server
npm run dev
```

### 3. Start Support Services

```bash
# Start Redis (for caching and queues)
docker run -d -p 6379:6379 redis:alpine

# Start MongoDB (for data storage)
docker run -d -p 27017:27017 mongo:latest

# Start Celery worker (for background tasks)
cd backend
celery -A app.core.celery worker --loglevel=info
```

## 🎯 First Steps with CodeBuddy

### 1. Setup Your First Repository

1. Navigate to http://localhost:3000
2. Go to the **Repository Setup** page
3. Enter your GitHub repository URL:
   ```
   https://github.com/username/repository-name
   ```
4. (Optional) Add GitHub token for private repositories
5. Click **Analyze Repository**

### 2. Monitor Processing

Track the analysis progress:

```bash
# Get task status
curl http://localhost:8000/tools/task-status/{task_id}
```

### 3. Start Chatting with Your Code

Once processing is complete:

1. Go to the **Chat** section
2. Ask questions like:
   - "What does the main function do?"
   - "Show me all the API endpoints"
   - "How is authentication implemented?"
   - "Explain the database schema"

### 4. Generate Code Diagrams

1. Navigate to the **Diagrams** section
2. Enter requests like:
   - "Create a flowchart of the authentication process"
   - "Generate a class diagram for the user module"
   - "Show the API call sequence for user registration"

## 🔧 Configuration

### Essential Environment Variables

**Backend (.env)**:
```env
# AI Configuration
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Database
MONGODB_URL=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your_secret_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## 📊 Verify Your Setup

### Test the Chat API

```bash
curl -X POST http://localhost:8000/chat/ \
  -H "Content-Type: application/json"

# Response should contain a chat_id
```

### Test Diagram Generation

```bash
curl -X POST http://localhost:8000/diagram/ \
  -H "Content-Type: application/json" \
  -d '{
    "github_username": "your_username",
    "github_token": "your_token",
    "user_input": "Create a simple flowchart",
    "title": "Test Diagram"
  }'
```

### Check Repository Processing

```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World"
  }'
```

## 🎉 You're Ready!

Congratulations! You now have CodeBuddy running. Here's what you can do next:

### Immediate Next Steps
1. **Explore the Interface** - Familiarize yourself with the web UI
2. **Try Different Queries** - Experiment with various code questions
3. **Generate Diagrams** - Create visualizations of your code
4. **Check the API Docs** - Visit http://localhost:8000/docs

### Learn More
- [Chat Guide](../guides/chat.md) - Master conversational code analysis
- [Diagram Guide](../guides/diagrams.md) - Create stunning code visualizations
- [API Reference](../api/overview.md) - Integrate CodeBuddy into your workflow

## 🆘 Need Help?

### Common Issues

**Port Already in Use**:
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8000

# Kill the process or use different ports
```

**Docker Issues**:
```bash
# Reset Docker environment
docker-compose down --volumes --remove-orphans
docker-compose up --build
```

**Database Connection**:
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check Redis connection
redis-cli ping
```

### Get Support

- **Documentation**: Check our comprehensive guides
- **GitHub Issues**: Report bugs or request features
- **Troubleshooting**: See our [troubleshooting guide](./troubleshooting.md)

---

**Ready to dive deeper?** Check out our User Guides or explore the API Documentation! 🚀