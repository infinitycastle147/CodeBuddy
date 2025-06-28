# 🔌 CodeBuddy API Overview

The CodeBuddy API provides powerful endpoints for conversational code analysis, diagram generation, and repository processing. Built with FastAPI, it offers high performance, automatic documentation, and type safety.

## 🌐 Base URL

```
Production: https://api.codebuddy.dev
Development: http://localhost:8000
```

## 📖 Interactive Documentation

CodeBuddy provides interactive API documentation:

- **Swagger UI**: `{base_url}/docs`
- **ReDoc**: `{base_url}/redoc`
- **OpenAPI Schema**: `{base_url}/openapi.json`

## 🏗️ API Architecture

### Core Services

| Service | Purpose | Base Path |
|---------|---------|-----------|
| **Chat** | Conversational code analysis | `/chat` |
| **Diagrams** | Code visualization generation | `/diagram` |
| **Tools** | Repository processing & utilities | `/tools` |
| **Users** | User management | `/user` |
| **Health** | System monitoring | `/health` |

### Request/Response Format

All APIs use JSON for both requests and responses:

```http
Content-Type: application/json
Accept: application/json
```

## 🔐 Authentication

CodeBuddy uses GitHub integration for authentication. Most endpoints require:

- **GitHub Username**: Your GitHub username
- **GitHub Token**: Personal access token for repository access
- **Optional Jira Credentials**: For enhanced project management integration

### Example Authentication

```json
{
  "github_username": "your_username",
  "github_token": "ghp_your_personal_access_token",
  "jira_username": "optional_jira_user",
  "jira_apiToken": "optional_jira_token",
  "jira_project_name": "optional_project",
  "jira_url": "https://your-company.atlassian.net"
}
```

## 📊 Core Endpoints Overview

### Health Check
```http
GET /health
```
System-wide health monitoring for load balancers and monitoring tools.

### Chat Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/` | Create new chat session |
| `GET` | `/chat/{chat_id}` | Retrieve chat session |
| `POST` | `/chat/{chat_id}/message` | Send message and get AI response |
| `GET` | `/chat/health` | Chat service health check |

### Diagram Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/diagram/` | Generate new diagram |
| `GET` | `/diagram/` | List all diagrams |
| `GET` | `/diagram/{diagram_id}` | Get specific diagram |
| `PATCH` | `/diagram/{diagram_id}` | Update diagram content |
| `GET` | `/diagram/health` | Diagram service health check |

### Repository Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tools/setup` | Start repository analysis |
| `GET` | `/tools/task-status/{task_id}` | Check analysis progress |
| `GET` | `/tools/health` | Tools service health check |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/user/` | Create new user |
| `GET` | `/user/` | List all users |
| `GET` | `/user/{user_id}` | Get user by ID |
| `GET` | `/user/email/{email}` | Get user by email |
| `GET` | `/user/health` | User service health check |

## 🚀 Quick Start Examples

### 1. Create a Chat Session

```bash
curl -X POST http://localhost:8000/chat/ \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "chat_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-01-15T10:30:00Z",
  "status": "active"
}
```

### 2. Send a Message

```bash
curl -X POST http://localhost:8000/chat/550e8400-e29b-41d4-a716-446655440000/message \
  -H "Content-Type: application/json" \
  -d '{
    "github_username": "octocat",
    "github_token": "ghp_your_token",
    "message": "Explain the main function in this repository"
  }'
```

### 3. Generate a Diagram

```bash
curl -X POST http://localhost:8000/diagram/ \
  -H "Content-Type: application/json" \
  -d '{
    "github_username": "octocat",
    "github_token": "ghp_your_token",
    "user_input": "Create a flowchart of the authentication process",
    "title": "Auth Flow",
    "description": "User authentication flowchart"
  }'
```

### 4. Setup Repository Analysis

```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World",
    "access_token": "ghp_your_token"
  }'
```

**Response:**
```json
{
  "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
  "status": "PENDING",
  "message": "Repository analysis started"
}
```

### 5. Check Task Status

```bash
curl http://localhost:8000/tools/task-status/c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6
```

**Response:**
```json
{
  "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
  "status": "SUCCESS",
  "progress": 100,
  "result": {
    "files_processed": 42,
    "embeddings_created": 156,
    "completion_time": "2024-01-15T10:35:00Z"
  }
}
```

## 📋 Common Request Patterns

### Standard Request Structure

Most CodeBuddy APIs follow this pattern:

```json
{
  "github_username": "required_string",
  "github_token": "required_string",
  "jira_username": "optional_string",
  "jira_apiToken": "optional_string", 
  "jira_project_name": "optional_string",
  "jira_url": "optional_string",
  "...additional_fields": "..."
}
```

### Response Structure

Standard success response:

```json
{
  "id": "resource_id",
  "status": "success|pending|error",
  "data": { /* resource_data */ },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error response:

```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": { /* additional_error_info */ },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔄 Async Operations

Some operations like repository analysis run asynchronously:

1. **Start Operation**: POST to endpoint returns `task_id`
2. **Poll Status**: GET `/tools/task-status/{task_id}` 
3. **Check Result**: Status will be `PENDING`, `SUCCESS`, or `FAILURE`

### Task Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Task is queued or running |
| `SUCCESS` | Task completed successfully |
| `FAILURE` | Task failed with error |
| `REVOKED` | Task was cancelled |

## ⚡ Rate Limiting

Current API limits:

- **Chat Messages**: 100 per hour per user
- **Diagram Generation**: 20 per hour per user  
- **Repository Setup**: 5 per hour per user
- **General Requests**: 1000 per hour per user

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642248600
```

## 🛡️ Security Features

### Input Validation
- All inputs validated against schemas
- Protection against injection attacks
- File type and size restrictions

### Authentication
- GitHub token verification
- Secure credential handling
- Token scope validation

### Data Protection
- Encrypted credential storage
- Automatic cleanup of processed data
- No persistent storage of repository content

## 📚 Next Steps

Explore specific API endpoints:

- **[Chat API](./chat.md)** - Conversational code analysis
- **[Diagram API](./diagrams.md)** - Code visualization
- **[Tools API](./tools.md)** - Repository processing


## 🤝 SDK & Libraries

While no official SDKs exist yet, the API is designed to be easy to integrate:

### Python Example
```python
import requests

class CodeBuddyClient:
    def __init__(self, base_url, github_username, github_token):
        self.base_url = base_url
        self.auth = {
            "github_username": github_username,
            "github_token": github_token
        }
    
    def create_chat(self):
        response = requests.post(f"{self.base_url}/chat/")
        return response.json()
    
    def send_message(self, chat_id, message):
        data = {**self.auth, "message": message}
        response = requests.post(
            f"{self.base_url}/chat/{chat_id}/message",
            json=data
        )
        return response.json()
```

### JavaScript Example
```javascript
class CodeBuddyAPI {
  constructor(baseURL, githubUsername, githubToken) {
    this.baseURL = baseURL;
    this.auth = {
      github_username: githubUsername,
      github_token: githubToken
    };
  }

  async createChat() {
    const response = await fetch(`${this.baseURL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async sendMessage(chatId, message) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...this.auth, message })
    });
    return response.json();
  }
}
```

---

**Ready to start building?** Check out our detailed endpoint documentation or try the interactive API explorer at `/docs`! 🚀

## 🤝 SDK & Libraries

While no official SDKs exist yet, the API is designed to be easy to integrate:

### Python Example
```python
import requests

class CodeBuddyClient:
    def __init__(self, base_url, github_username, github_token):
        self.base_url = base_url
        self.auth = {
            "github_username": github_username,
            "github_token": github_token
        }
    
    def create_chat(self):
        response = requests.post(f"{self.base_url}/chat/")
        return response.json()
    
    def send_message(self, chat_id, message):
        data = {**self.auth, "message": message}
        response = requests.post(
            f"{self.base_url}/chat/{chat_id}/message",
            json=data
        )
        return response.json()
```

### JavaScript Example
```javascript
class CodeBuddyAPI {
  constructor(baseURL, githubUsername, githubToken) {
    this.baseURL = baseURL;
    this.auth = {
      github_username: githubUsername,
      github_token: githubToken
    };
  }

  async createChat() {
    const response = await fetch(`${this.baseURL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async sendMessage(chatId, message) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...this.auth, message })
    });
    return response.json();
  }
}
```

---

**Ready to start building?** Check out our detailed endpoint documentation or try the interactive API explorer at `/docs`! 🚀