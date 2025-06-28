# 💬 Chat API Guide

The Chat API enables natural language conversations with your codebase. Ask questions, get explanations, and explore your code through an intuitive conversational interface powered by multi-agent AI.

## 🎯 Overview

The Chat API provides endpoints to:
- Create new chat sessions
- Send messages and receive AI responses
- Retrieve chat history
- Monitor chat service health

## 🔗 Endpoints

### Base Path: `/chat`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/` | Create new chat session |
| `GET` | `/chat/{chat_id}` | Retrieve chat session |
| `POST` | `/chat/{chat_id}/message` | Send message and get AI response |
| `GET` | `/chat/health` | Chat service health check |

## 📊 Detailed Endpoint Reference

### 1. Create Chat Session

Create a new chat session to start conversing with your code.

```http
POST /chat/
```

**Request:**
```bash
curl -X POST http://localhost:8000/chat/ \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "chat_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "created_at": "2024-01-15T10:30:00Z",
  "status": "active",
  "message": "Chat session created successfully"
}
```

**Response Codes:**
- `201` - Chat session created successfully
- `500` - Internal server error

### 2. Send Message

Send a message to an existing chat session and receive an AI response.

```http
POST /chat/{chat_id}/message
```

**Parameters:**
- `chat_id` (path) - Unique identifier for the chat session

**Request Body:**
```json
{
  "github_username": "string",
  "github_token": "string", 
  "jira_username": "string",
  "jira_apiToken": "string",
  "jira_project_name": "string",
  "jira_url": "string",
  "message": "string"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/chat/f47ac10b-58cc-4372-a567-0e02b2c3d479/message \
  -H "Content-Type: application/json" \
  -d '{
    "github_username": "octocat",
    "github_token": "ghp_your_personal_access_token",
    "message": "What does the main function do in this repository?"
  }'
```

**Example Response:**
```json
{
  "message_id": "msg_123456",
  "chat_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "user_message": "What does the main function do in this repository?",
  "ai_response": {
    "content": "The main function in this repository serves as the entry point for the application. It performs the following key operations:\n\n1. **Configuration Loading**: Loads environment variables and configuration settings\n2. **Database Connection**: Establishes connection to the MongoDB database\n3. **API Server Setup**: Initializes the FastAPI server with middleware\n4. **Route Registration**: Registers all API endpoints and handlers\n5. **Background Tasks**: Starts Celery workers for async processing\n\nHere's the relevant code snippet:\n```python\ndef main():\n    load_dotenv()\n    app = create_app()\n    uvicorn.run(app, host=\"0.0.0.0\", port=8000)\n```",
    "code_references": [
      {
        "file": "main.py",
        "line_start": 15,
        "line_end": 18,
        "snippet": "def main():\n    load_dotenv()\n    app = create_app()\n    uvicorn.run(app, host=\"0.0.0.0\", port=8000)"
      }
    ],
    "confidence": 0.95
  },
  "timestamp": "2024-01-15T10:32:15Z",
  "processing_time_ms": 1250
}
```

**Response Codes:**
- `201` - Message processed successfully
- `404` - Chat session not found
- `422` - Invalid request data
- `500` - Internal server error

### 3. Get Chat Session

Retrieve an existing chat session with its message history.

```http
GET /chat/{chat_id}
```

**Parameters:**
- `chat_id` (path) - Unique identifier for the chat session

**Example Request:**
```bash
curl http://localhost:8000/chat/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Example Response:**
```json
{
  "chat_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:32:15Z",
  "status": "active",
  "message_count": 3,
  "messages": [
    {
      "message_id": "msg_123456",
      "user_message": "What does the main function do?",
      "ai_response": "The main function serves as...",
      "timestamp": "2024-01-15T10:32:15Z"
    }
  ],
  "metadata": {
    "repository_context": "octocat/Hello-World",
    "total_tokens_used": 1250,
    "average_response_time_ms": 1180
  }
}
```

**Response Codes:**
- `200` - Chat session retrieved successfully
- `404` - Chat session not found
- `422` - Invalid chat ID format
- `500` - Internal server error

### 4. Health Check

Check if the chat service is operational.

```http
GET /chat/health
```

**Example Request:**
```bash
curl http://localhost:8000/chat/health
```

**Example Response:**
```json
{
  "status": "healthy",
  "service": "chat",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "0.1.0",
  "dependencies": {
    "ai_service": "connected",
    "database": "connected",
    "cache": "connected"
  }
}
```

## 🤖 AI Capabilities

The Chat API leverages advanced AI capabilities to understand and explain your code:

### Supported Query Types

| Query Type | Example | AI Capability |
|------------|---------|---------------|
| **Function Explanation** | "What does the login function do?" | Code analysis and explanation |
| **Architecture Questions** | "How is the API structured?" | High-level system understanding |
| **Code Search** | "Show me all database queries" | Semantic code search |
| **Bug Analysis** | "Why might this function fail?" | Error analysis and debugging |
| **Best Practices** | "Is this code following best practices?" | Code quality assessment |
| **Documentation** | "Generate docs for this module" | Automatic documentation |

### Example Conversations

#### Code Explanation
```
User: "Explain the authentication middleware"

AI: "The authentication middleware validates incoming requests by:

1. **Token Extraction**: Retrieves the JWT token from the Authorization header
2. **Token Validation**: Verifies the token signature and expiration
3. **User Context**: Loads user information from the database
4. **Permission Check**: Validates user permissions for the requested resource

Key implementation details:
- Uses RS256 algorithm for token signing
- Implements token refresh logic for expired tokens
- Handles rate limiting per user
- Provides detailed error responses for debugging

Here's the core validation logic:
```python
async def validate_token(token: str) -> User:
    try:
        payload = jwt.decode(token, PUBLIC_KEY, algorithms=['RS256'])
        user_id = payload.get('user_id')
        return await get_user_by_id(user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, 'Token expired')
```" 
```

#### Architecture Overview
```
User: "How does the system handle file uploads?"

AI: "The file upload system uses a multi-stage approach:

**Upload Flow:**
1. Client uploads to `/upload` endpoint
2. File validation (type, size, security scan)
3. Temporary storage in Redis cache
4. Background processing via Celery
5. Final storage in MongoDB GridFS
6. Cleanup of temporary files

**Security Features:**
- File type validation using magic numbers
- Virus scanning integration
- Size limits (50MB max)
- User quota enforcement

**Performance Optimizations:**
- Chunked upload for large files
- Progress tracking via WebSocket
- Automatic compression for text files
- CDN integration for public files"
```

### Advanced Features

#### Multi-Language Code Analysis
The AI can understand and explain code in multiple programming languages:

```
User: "Compare the Python and JavaScript implementations"

AI: "Here's a comparison of the authentication implementations:

**Python (FastAPI)**:
- Uses dependency injection for clean separation
- Leverages Pydantic for request validation
- Implements async/await for better performance

**JavaScript (Express)**:
- Uses middleware pattern for request processing
- Implements promise-based async handling
- Uses Joi for input validation

Both implementations follow similar security practices but differ in their architectural approaches."
```

#### Cross-Repository Context
When multiple repositories are connected:

```
User: "How does this service communicate with the user service?"

AI: "The communication between services follows a microservices pattern:

**API Gateway**: Routes requests to appropriate services
**Service Discovery**: Uses Consul for service registration
**Authentication**: Shared JWT tokens via Redis
**Data Consistency**: Event-driven updates using message queues

The integration points are:
1. User creation events trigger profile setup
2. Authentication tokens are validated cross-service
3. User preferences sync via background jobs"
```

## 🛡️ Security & Authentication

### Required Fields

| Field | Required | Description |
|-------|----------|-------------|
| `github_username` | ✅ | GitHub username for repository access |
| `github_token` | ✅ | Personal access token with repo permissions |
| `jira_username` | ❌ | Optional Jira integration username |
| `jira_apiToken` | ❌ | Optional Jira API token |
| `jira_project_name` | ❌ | Optional Jira project identifier |
| `jira_url` | ❌ | Optional Jira instance URL |

### GitHub Token Permissions

Your GitHub token should have these permissions:
- `repo` - Access to repository content
- `read:user` - Read user profile information
- `read:org` - Read organization membership (for private org repos)

### Security Best Practices

1. **Token Security**:
   ```bash
   # Use environment variables
   export GITHUB_TOKEN="ghp_your_token_here"
   
   # Or secure credential store
   echo $GITHUB_TOKEN | gh auth login --with-token
   ```

2. **Token Rotation**:
   - Regularly rotate your GitHub tokens
   - Monitor token usage in GitHub settings
   - Revoke unused or compromised tokens

3. **Scope Limitation**:
   - Use fine-grained tokens when available
   - Limit token scope to required repositories
   - Avoid using admin-level tokens

## 🚀 Best Practices

### Effective Questioning

#### Be Specific
```bash
# Good
"How does the JWT token validation work in the auth middleware?"

# Better  
"Explain the error handling in the JWT validation function on line 45 of auth.py"
```

#### Provide Context
```bash
# Good
"Why is this function slow?"

# Better
"The user registration function takes 3 seconds to complete. What could be causing the performance issue?"
```

#### Ask Follow-ups
```bash
User: "Explain the database schema"
AI: [Provides schema explanation]
User: "What are the potential performance bottlenecks in this schema?"
AI: [Provides performance analysis]
```

### Session Management

#### Long Conversations
- Keep related questions in the same session for context
- Create new sessions for different topics/repositories
- Sessions maintain context for up to 100 messages

#### Context Preservation
```javascript
// Maintain conversation flow
const chatId = await createChat();

// Related questions maintain context
await sendMessage(chatId, "Explain the user model");
await sendMessage(chatId, "How is it validated?");
await sendMessage(chatId, "Show me the database indexes");
```

## 📊 Response Format Details

### Message Structure

```typescript
interface ChatResponse {
  message_id: string;
  chat_id: string;
  user_message: string;
  ai_response: {
    content: string;
    code_references?: CodeReference[];
    confidence: number;
    suggestions?: string[];
  };
  timestamp: string;
  processing_time_ms: number;
  metadata?: {
    tokens_used: number;
    model_version: string;
    repository_context: string;
  };
}

interface CodeReference {
  file: string;
  line_start: number;
  line_end: number;
  snippet: string;
  relevance_score: number;
}
```

### Error Responses

```json
{
  "error": "invalid_token",
  "message": "GitHub token is invalid or expired",
  "details": {
    "error_code": "GITHUB_AUTH_FAILED",
    "suggestion": "Please check your GitHub token permissions"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔧 Integration Examples

### Python Integration

```python
import asyncio
import aiohttp

class CodeBuddyChat:
    def __init__(self, base_url, github_username, github_token):
        self.base_url = base_url
        self.auth = {
            "github_username": github_username,
            "github_token": github_token
        }
        self.session = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def create_chat(self):
        async with self.session.post(f"{self.base_url}/chat/") as response:
            data = await response.json()
            return data["chat_id"]
    
    async def send_message(self, chat_id, message):
        payload = {**self.auth, "message": message}
        async with self.session.post(
            f"{self.base_url}/chat/{chat_id}/message",
            json=payload
        ) as response:
            return await response.json()

# Usage
async def main():
    async with CodeBuddyChat("http://localhost:8000", "username", "token") as chat:
        chat_id = await chat.create_chat()
        response = await chat.send_message(chat_id, "Explain the main function")
        print(response["ai_response"]["content"])

asyncio.run(main())
```

### JavaScript/Node.js Integration

```javascript
class CodeBuddyChat {
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
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.chat_id;
  }

  async sendMessage(chatId, message) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...this.auth, message })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getChatHistory(chatId) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Usage
const chat = new CodeBuddyChat('http://localhost:8000', 'username', 'token');

async function askQuestion() {
  try {
    const chatId = await chat.createChat();
    const response = await chat.sendMessage(chatId, 'How does authentication work?');
    console.log(response.ai_response.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

askQuestion();
```

### React Hook Example

```typescript
import { useState, useCallback } from 'react';

interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  timestamp: string;
}

export function useCodeBuddyChat(baseURL: string, githubUsername: string, githubToken: string) {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChat = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}/chat/`, { method: 'POST' });
      const data = await response.json();
      setChatId(data.chat_id);
      return data.chat_id;
    } catch (err) {
      setError('Failed to create chat session');
      throw err;
    }
  }, [baseURL]);

  const sendMessage = useCallback(async (message: string) => {
    if (!chatId) {
      throw new Error('No active chat session');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseURL}/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_username: githubUsername,
          github_token: githubToken,
          message
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: data.message_id,
        user_message: data.user_message,
        ai_response: data.ai_response.content,
        timestamp: data.timestamp
      }]);

      return data;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseURL, chatId, githubUsername, githubToken]);

  return {
    chatId,
    messages,
    loading,
    error,
    createChat,
    sendMessage
  };
}
```

## 📈 Performance & Limits

### Rate Limits
- **Messages per hour**: 100 per user
- **Concurrent chats**: 5 per user
- **Message length**: 10,000 characters max
- **Response timeout**: 30 seconds

### Performance Tips

1. **Batch Related Questions**: Keep related questions in the same session
2. **Be Specific**: More specific questions get faster, more accurate responses
3. **Use Context**: Reference previous messages for follow-up questions
4. **Optimize Tokens**: GitHub tokens with minimal required permissions

### Monitoring Response Times

```javascript
const startTime = Date.now();
const response = await chat.sendMessage(chatId, message);
const responseTime = Date.now() - startTime;
console.log(`Response time: ${responseTime}ms`);
```

## 🆘 Troubleshooting

### Common Issues

#### Invalid GitHub Token
```json
{
  "error": "authentication_failed",
  "message": "GitHub token is invalid or lacks required permissions"
}
```
**Solution**: Check token permissions and expiration

#### Chat Session Not Found
```json
{
  "error": "chat_not_found", 
  "message": "Chat session does not exist or has expired"
}
```
**Solution**: Create a new chat session

#### Rate Limit Exceeded
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later."
}
```
**Solution**: Wait for rate limit reset or optimize request frequency

### Debug Mode

Enable verbose logging:

```bash
curl -X POST http://localhost:8000/chat/chatid/message \
  -H "Content-Type: application/json" \
  -H "X-Debug-Mode: true" \
  -d '{"message": "debug this issue"}'
```

## 🔄 What's Next?

- **[Diagram API](./diagrams.md)** - Generate code visualizations
- **[Tools API](./tools.md)** - Repository processing
- **[Advanced Features](../guides/advanced-features.md)** - Power user capabilities
- **[Authentication Guide](./authentication.md)** - Security best practices

---

**Ready to start chatting with your code?** Try the interactive examples or explore our [Chat Guide](../guides/chat-guide.md)! 💬
