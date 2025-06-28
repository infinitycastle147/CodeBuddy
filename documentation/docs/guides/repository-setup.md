# 📂 Repository Setup Guide

Learn how to connect and analyze your GitHub repositories with CodeBuddy. This guide walks you through the entire process from initial setup to advanced configuration options.

## 🎯 Overview

Repository setup is the foundation of using CodeBuddy effectively. Once your repository is analyzed, you can:
- Chat with your codebase using natural language
- Generate diagrams and visualizations
- Search code semantically
- Get AI-powered insights and explanations

## 🚀 Quick Setup

### Step 1: Access Repository Setup

1. **Navigate to Setup**: Go to the Repository Setup section in your dashboard
2. **Choose Method**: Use either the web interface or API directly
3. **Prepare Credentials**: Have your GitHub access token ready

### Step 2: Provide Repository Information

Fill in the repository details:

```
Repository URL: https://github.com/username/repository-name
Branch (optional): main
GitHub Token: ghp_your_personal_access_token
```

### Step 3: Start Analysis

Click **"Analyze Repository"** and monitor the progress:

```
🔄 Repository Analysis Progress

Phase 1: Cloning repository... ✅ Complete
Phase 2: Scanning files... ⏳ In Progress (45%)
Phase 3: Analyzing code structure... ⏳ Pending
Phase 4: Generating embeddings... ⏳ Pending
Phase 5: Building search index... ⏳ Pending

Estimated time remaining: 8 minutes
```

## 🔐 GitHub Token Setup

### Creating a Personal Access Token

1. **Go to GitHub Settings**:
   - Click your profile picture → Settings
   - Navigate to Developer settings → Personal access tokens → Tokens (classic)

2. **Create New Token**:
   - Click "Generate new token (classic)"
   - Add a descriptive note: "CodeBuddy Repository Analysis"
   - Set expiration (90 days recommended)

3. **Select Permissions**:
   ```
   Required Scopes:
   ✅ repo (for private repositories)
   ✅ public_repo (for public repositories)
   ✅ read:user (for user information)
   ✅ read:org (for organization repositories)
   
   Optional Scopes:
   ✅ read:project (for project insights)
   ```

4. **Generate and Copy Token**:
   - Click "Generate token"
   - **Important**: Copy the token immediately (you won't see it again)

### Token Security Best Practices

```bash
# Store token securely in environment variable
export GITHUB_TOKEN="ghp_your_token_here"

# Or use GitHub CLI
gh auth login --with-token < token.txt

# Verify token permissions
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user
```

## 📊 Repository Analysis Process

### What Gets Analyzed

CodeBuddy analyzes various aspects of your repository:

#### 1. File Structure
```
📁 Repository Scan
├── 📄 Source files (.py, .js, .ts, .java, etc.)
├── 📄 Configuration files (.json, .yaml, .toml)
├── 📄 Documentation files (.md, .rst, .txt)
├── 📄 Test files (*test*, *spec*)
└── 📄 Build files (Dockerfile, Makefile, etc.)
```

#### 2. Code Elements
- **Functions and Methods**: Signatures, parameters, return types
- **Classes and Interfaces**: Properties, methods, inheritance
- **Variables and Constants**: Types, scopes, usage patterns
- **Imports and Dependencies**: Module relationships, external libraries

#### 3. Documentation
- **Docstrings**: Function and class documentation
- **Comments**: Inline code comments
- **README Files**: Project documentation
- **API Documentation**: Endpoint descriptions

#### 4. Relationships
- **Call Graphs**: Function call relationships
- **Dependency Trees**: Module dependencies
- **Inheritance Hierarchies**: Class relationships
- **Data Flow**: Variable and data movement

### Analysis Metrics

After analysis, you'll see detailed metrics:

```json
{
  "repository_stats": {
    "total_files": 342,
    "lines_of_code": 28467,
    "languages": {
      "Python": 65,
      "JavaScript": 20,
      "TypeScript": 10,
      "CSS": 3,
      "HTML": 2
    },
    "complexity_score": 7.2,
    "test_coverage_estimate": 78
  },
  "analysis_results": {
    "functions_found": 1247,
    "classes_found": 189,
    "embeddings_created": 3456,
    "processing_time_minutes": 12
  }
}
```

## 🔧 Advanced Configuration

### Branch-Specific Analysis

Analyze specific branches for feature development:

```javascript
// Web interface
const analysisConfig = {
  repository_url: "https://github.com/company/project",
  branch: "feature/new-authentication",
  access_token: "ghp_token",
  force_reanalysis: false
}

// API call
fetch('/api/tools/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(analysisConfig)
})
```

### Multiple Repository Management

Organize multiple repositories:

```
📂 My Repositories
├── 🔄 company/frontend (Analyzing...)
├── ✅ company/backend (Ready)
├── ✅ company/shared-lib (Ready)
└── ⏸️ personal/side-project (Paused)

Analysis Queue:
1. company/mobile-app (Pending)
2. company/docs (Pending)
```

### Custom File Filters

Configure which files to include/exclude:

```yaml
# .codebuddy.yml (in repository root)
analysis:
  include_patterns:
    - "src/**/*.py"
    - "lib/**/*.js"
    - "tests/**/*.py"
  
  exclude_patterns:
    - "node_modules/**"
    - "**/*.pyc"
    - "dist/**"
    - "build/**"
  
  max_file_size_mb: 5
  languages: ["python", "javascript", "typescript"]
```

## 📈 Monitoring Analysis Progress

### Real-Time Progress Tracking

Monitor analysis through the web interface:

```
🔍 Real-Time Analysis Monitor

Repository: github.com/company/project
Branch: main
Started: 2024-01-15 10:30:00

Current Phase: Generating Embeddings
Progress: 67% (2,341 / 3,456 files)
Time Elapsed: 8m 23s
Time Remaining: ~4m 15s

Recent Activity:
✅ Analyzed src/auth/models.py (156 lines)
✅ Analyzed src/api/routes.py (89 lines)
🔄 Processing src/services/payment.py (312 lines)
⏳ Queued: src/utils/helpers.py
```

### API Progress Monitoring

Poll progress programmatically:

```python
import asyncio
import aiohttp

async def monitor_analysis(task_id):
    async with aiohttp.ClientSession() as session:
        while True:
            async with session.get(f"/api/tools/task-status/{task_id}") as response:
                data = await response.json()
                
                status = data["status"]
                progress = data.get("progress", 0)
                
                print(f"Status: {status}, Progress: {progress}%")
                
                if status == "SUCCESS":
                    print("Analysis complete!")
                    return data["result"]
                elif status == "FAILURE":
                    print(f"Analysis failed: {data['error']}")
                    return None
                
                await asyncio.sleep(10)  # Check every 10 seconds

# Usage
result = await monitor_analysis("task-123-456")
```

## 🔍 Troubleshooting Common Issues

### Repository Access Issues

#### Private Repository Access Denied
```
❌ Error: Repository not found or access denied

✅ Solutions:
• Ensure your GitHub token has 'repo' scope
• Verify the repository URL is correct
• Check if you have access to the repository
• For organization repos, ensure token has 'read:org' scope
```

#### Token Permissions Insufficient
```
❌ Error: Insufficient permissions for repository access

✅ Solutions:
• Regenerate token with proper scopes
• For private repos: enable 'repo' scope
• For organization repos: enable 'read:org' scope
• Verify token hasn't expired
```

### Analysis Performance Issues

#### Large Repository Timeouts
```
❌ Error: Analysis timeout after 45 minutes

✅ Solutions:
• Break analysis into smaller branches
• Use file filters to exclude unnecessary files
• Exclude large binary files and dependencies
• Contact support for repositories > 5000 files
```

#### Memory Issues During Processing
```
❌ Error: Out of memory during embedding generation

✅ Solutions:
• Reduce max file size limit
• Exclude large text files
• Process smaller subsets of the repository
• Try analysis during off-peak hours
```

### File Processing Issues

#### Unsupported File Types
```
ℹ️ Notice: Some files skipped during analysis

Supported: .py, .js, .ts, .java, .go, .cpp, .cs, .rb, .php, .rs
Skipped: .exe, .dll, .so, .a, .o, binary files

✅ Solutions:
• This is normal behavior
• Focus on source code files
• Use .codebuddy.yml to customize filters
```

#### Encoding Issues
```
❌ Error: Unable to decode file content

✅ Solutions:
• Ensure files use UTF-8 encoding
• Check for binary files with source extensions
• Exclude problematic files using filters
```

## 🎯 Optimization Tips

### Faster Analysis

1. **Use File Filters**: Exclude unnecessary files
   ```yaml
   exclude_patterns:
     - "node_modules/**"
     - "vendor/**"
     - "*.min.js"
     - "dist/**"
   ```

2. **Choose Specific Branches**: Analyze only relevant branches
   ```bash
   # Analyze feature branch instead of main
   branch: "feature/user-authentication"
   ```

3. **Limit File Size**: Set reasonable file size limits
   ```yaml
   max_file_size_mb: 2  # Skip files larger than 2MB
   ```

### Better Analysis Quality

1. **Include Documentation**: Don't exclude README and docs
   ```yaml
   include_patterns:
     - "docs/**/*.md"
     - "README.md"
     - "**/*.rst"
   ```

2. **Include Tests**: Tests provide valuable context
   ```yaml
   include_patterns:
     - "tests/**/*"
     - "**/*test*.py"
     - "**/*spec*.js"
   ```

3. **Include Configuration**: Config files show system architecture
   ```yaml
   include_patterns:
     - "*.json"
     - "*.yaml"
     - "*.toml"
     - "Dockerfile"
   ```

## 🔄 Re-analysis and Updates

### When to Re-analyze

Re-analyze your repository when:
- **Major code changes**: Significant refactoring or new features
- **Dependency updates**: New libraries or framework versions
- **Architecture changes**: New modules or service restructuring
- **Documentation updates**: Important README or API doc changes

### Automatic Re-analysis

Set up automatic re-analysis triggers:

```yaml
# .github/workflows/codebuddy-analysis.yml
name: CodeBuddy Re-analysis
on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'lib/**'
      - 'requirements.txt'
      - 'package.json'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger CodeBuddy Analysis
        run: |
          curl -X POST "https://api.codebuddy.dev/tools/setup" \
            -H "Content-Type: application/json" \
            -d '{
              "repo_url": "${{ github.repositoryUrl }}",
              "access_token": "${{ secrets.GITHUB_TOKEN }}",
              "branch": "${{ github.ref_name }}",
              "force_reanalysis": true
            }'
```

### Manual Re-analysis

Force re-analysis through the interface:

```
🔄 Re-analysis Options

Repository: company/project
Last analyzed: 2 days ago
Status: Ready

□ Force complete re-analysis
□ Update only changed files
□ Analyze new branch: [dropdown]

[Re-analyze Repository]
```

## 📚 Next Steps

After successful repository setup:

1. **[Start Chatting](./chat)** - Ask questions about your code
2. **[Generate Diagrams](./diagrams)** - Visualize your architecture

4. **[API Integration](../api/tools)** - Programmatic access

---

Ready to set up your first repository? Navigate to the Repository Setup page and get started! 🚀