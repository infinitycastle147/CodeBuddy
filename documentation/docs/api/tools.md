# 🛠️ Tools API

The Tools API provides endpoints for repository processing, code analysis, and utility functions. This is the foundation that powers CodeBuddy's ability to understand and analyze your codebase.

## 🔗 Endpoints

### Base Path: `/tools`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tools/setup` | Start repository analysis |
| `GET` | `/tools/task-status/{task_id}` | Check analysis progress |
| `GET` | `/tools/health` | Tools service health check |

## 📋 Repository Setup

### Start Repository Analysis

Begin analyzing a GitHub repository for chat and diagram generation.

```http
POST /tools/setup
```

**Request Body:**
```json
{
  "repo_url": "string",
  "access_token": "string",
  "branch": "string",
  "force_reanalysis": false
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World",
    "access_token": "ghp_your_personal_access_token",
    "branch": "main"
  }'
```

**Example Response:**
```json
{
  "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
  "status": "PENDING",
  "message": "Repository analysis started",
  "estimated_duration_minutes": 5,
  "repository": {
    "name": "Hello-World",
    "owner": "octocat",
    "branch": "main",
    "private": false
  }
}
```

## 📊 Task Status Monitoring

### Check Analysis Progress

Monitor the progress of repository analysis tasks.

```http
GET /tools/task-status/{task_id}
```

**Example Request:**
```bash
curl http://localhost:8000/tools/task-status/c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6
```

**Example Response (In Progress):**
```json
{
  "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
  "status": "PROGRESS",
  "progress": 65,
  "current_step": "Generating embeddings",
  "steps_completed": [
    "Repository cloned",
    "Files analyzed",
    "Code structure extracted"
  ],
  "steps_remaining": [
    "Generating embeddings",
    "Building search index",
    "Cleanup temporary files"
  ],
  "estimated_time_remaining_minutes": 2
}
```

**Example Response (Completed):**
```json
{
  "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
  "status": "SUCCESS",
  "progress": 100,
  "result": {
    "files_processed": 156,
    "lines_of_code": 12847,
    "embeddings_created": 892,
    "languages_detected": ["Python", "JavaScript", "TypeScript", "CSS"],
    "completion_time": "2024-01-15T10:35:00Z",
    "processing_time_seconds": 287
  },
  "repository_stats": {
    "total_files": 156,
    "code_files": 134,
    "test_files": 22,
    "config_files": 8,
    "documentation_files": 12
  }
}
```

## 🔍 Analysis Process

### What Happens During Analysis

1. **Repository Cloning**: Downloads the repository to temporary storage
2. **File Discovery**: Scans for supported file types
3. **Code Parsing**: Analyzes code structure and relationships
4. **Content Extraction**: Extracts functions, classes, and documentation
5. **Embedding Generation**: Creates vector embeddings for semantic search
6. **Index Building**: Builds search indexes for fast retrieval
7. **Cleanup**: Removes temporary files

### Supported File Types

| Language | Extensions | Features |
|----------|------------|----------|
| **Python** | `.py`, `.pyi` | Functions, classes, imports, docstrings |
| **JavaScript** | `.js`, `.jsx` | Functions, classes, exports, JSDoc |
| **TypeScript** | `.ts`, `.tsx` | Types, interfaces, functions, classes |
| **Java** | `.java` | Classes, methods, packages, annotations |
| **Go** | `.go` | Functions, structs, packages |
| **C++** | `.cpp`, `.h`, `.hpp` | Functions, classes, namespaces |
| **C#** | `.cs` | Classes, methods, namespaces |
| **Rust** | `.rs` | Functions, structs, modules |
| **PHP** | `.php` | Functions, classes, namespaces |
| **Ruby** | `.rb` | Classes, methods, modules |

### Analysis Metrics

```json
{
  "complexity_analysis": {
    "average_function_complexity": 3.2,
    "most_complex_function": {
      "name": "process_payment",
      "file": "src/payment/processor.py",
      "complexity_score": 12
    },
    "total_complexity_score": 847
  },
  "code_quality": {
    "documentation_coverage": 78,
    "test_coverage_estimate": 65,
    "code_duplication_score": 15
  },
  "architecture_insights": {
    "design_patterns": ["Factory", "Observer", "Strategy"],
    "framework_usage": ["FastAPI", "React", "MongoDB"],
    "dependency_count": 42
  }
}
```

## ⚡ Performance and Limits

### Analysis Time Estimates

| Repository Size | Estimated Time | Notes |
|----------------|----------------|-------|
| Small (< 100 files) | 1-3 minutes | Quick analysis |
| Medium (100-1000 files) | 5-15 minutes | Standard processing |
| Large (1000-5000 files) | 15-45 minutes | Extended processing |
| Very Large (> 5000 files) | 45+ minutes | May require optimization |

### Rate Limits

- **Analysis Requests**: 5 per hour per user
- **Status Checks**: 100 per hour per user
- **Repository Size Limit**: 500MB maximum
- **File Count Limit**: 10,000 files maximum

### Resource Usage

```json
{
  "resources_used": {
    "disk_space_mb": 125,
    "processing_time_minutes": 8,
    "api_calls_made": 15,
    "embeddings_generated": 892,
    "memory_peak_mb": 512
  }
}
```

## 🔧 Advanced Configuration

### Force Re-analysis

Force re-analysis of previously analyzed repositories:

```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World",
    "access_token": "ghp_token",
    "force_reanalysis": true
  }'
```

### Branch-Specific Analysis

Analyze specific branches:

```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/octocat/Hello-World",
    "access_token": "ghp_token",
    "branch": "feature/new-auth"
  }'
```

### Private Repository Access

Access private repositories with proper tokens:

```bash
curl -X POST http://localhost:8000/tools/setup \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/private-org/private-repo",
    "access_token": "ghp_token_with_repo_access"
  }'
```

## 🛡️ Security and Privacy

### Data Handling

- **Temporary Storage**: Repository data is stored temporarily during analysis
- **Automatic Cleanup**: All temporary files are deleted after processing
- **No Persistent Storage**: Source code is not permanently stored
- **Secure Processing**: Analysis happens in isolated environments

### Access Controls

- **GitHub Token Validation**: Tokens are verified before processing
- **Repository Permissions**: Respects GitHub repository visibility settings
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Audit Logging**: All analysis requests are logged for security

## 🔄 Error Handling

### Common Error Responses

#### Repository Not Found

```json
{
  "error": "repository_not_found",
  "message": "Repository not found or access denied",
  "details": {
    "repository_url": "https://github.com/invalid/repo",
    "suggestion": "Check repository URL and access permissions"
  }
}
```

#### Invalid Access Token

```json
{
  "error": "invalid_token",
  "message": "GitHub access token is invalid or expired",
  "details": {
    "error_code": "GITHUB_AUTH_FAILED",
    "suggestion": "Generate a new personal access token"
  }
}
```

#### Repository Too Large

```json
{
  "error": "repository_too_large",
  "message": "Repository exceeds size limits",
  "details": {
    "repository_size_mb": 750,
    "max_allowed_mb": 500,
    "suggestion": "Use a smaller repository or contact support"
  }
}
```

#### Analysis Failed

```json
{
  "error": "analysis_failed",
  "message": "Repository analysis failed during processing",
  "details": {
    "task_id": "c47e4f1c-8b2a-4b5c-9d8e-f1a2b3c4d5e6",
    "failed_step": "embedding_generation",
    "error_details": "Insufficient memory for large files",
    "suggestion": "Try again or contact support"
  }
}
```

## 🚀 Integration Examples

### Python Integration

```python
import asyncio
import aiohttp
import time

class CodeBuddyTools:
    def __init__(self, base_url, access_token):
        self.base_url = base_url
        self.access_token = access_token
    
    async def analyze_repository(self, repo_url, branch="main"):
        """Start repository analysis and wait for completion."""
        async with aiohttp.ClientSession() as session:
            # Start analysis
            payload = {
                "repo_url": repo_url,
                "access_token": self.access_token,
                "branch": branch
            }
            
            async with session.post(
                f"{self.base_url}/tools/setup",
                json=payload
            ) as response:
                if response.status != 200:
                    raise Exception(f"Failed to start analysis: {response.status}")
                
                data = await response.json()
                task_id = data["task_id"]
                
            # Poll for completion
            while True:
                async with session.get(
                    f"{self.base_url}/tools/task-status/{task_id}"
                ) as response:
                    status_data = await response.json()
                    
                    if status_data["status"] == "SUCCESS":
                        return status_data["result"]
                    elif status_data["status"] == "FAILURE":
                        raise Exception(f"Analysis failed: {status_data}")
                    
                    print(f"Progress: {status_data.get('progress', 0)}%")
                    await asyncio.sleep(10)  # Check every 10 seconds

# Usage
async def main():
    tools = CodeBuddyTools("http://localhost:8000", "ghp_your_token")
    result = await tools.analyze_repository("https://github.com/octocat/Hello-World")
    print(f"Analysis complete! Processed {result['files_processed']} files")

asyncio.run(main())
```

### JavaScript Integration

```javascript
class CodeBuddyTools {
  constructor(baseURL, accessToken) {
    this.baseURL = baseURL;
    this.accessToken = accessToken;
  }

  async analyzeRepository(repoUrl, branch = 'main') {
    // Start analysis
    const response = await fetch(`${this.baseURL}/tools/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        repo_url: repoUrl,
        access_token: this.accessToken,
        branch
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to start analysis: ${response.status}`);
    }

    const { task_id } = await response.json();

    // Poll for completion
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          const statusResponse = await fetch(`${this.baseURL}/tools/task-status/${task_id}`);
          const statusData = await statusResponse.json();

          if (statusData.status === 'SUCCESS') {
            resolve(statusData.result);
          } else if (statusData.status === 'FAILURE') {
            reject(new Error(`Analysis failed: ${JSON.stringify(statusData)}`));
          } else {
            console.log(`Progress: ${statusData.progress || 0}%`);
            setTimeout(checkStatus, 10000); // Check every 10 seconds
          }
        } catch (error) {
          reject(error);
        }
      };

      checkStatus();
    });
  }
}

// Usage
const tools = new CodeBuddyTools('http://localhost:8000', 'ghp_your_token');

tools.analyzeRepository('https://github.com/octocat/Hello-World')
  .then(result => {
    console.log(`Analysis complete! Processed ${result.files_processed} files`);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });
```

## 🔄 What's Next?

After repository analysis is complete, you can:

- **[Chat with your code](./chat)** - Ask questions about the analyzed codebase
- **[Generate diagrams](./diagrams)** - Create visual representations of your code
- **[Explore the interface](../guides/repository-setup)** - Use the web interface for analysis

---

Ready to analyze your first repository? Start with the Repository Setup Guide! 🚀