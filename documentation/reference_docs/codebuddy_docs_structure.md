# CodeBuddy Documentation

Welcome to the comprehensive documentation for CodeBuddy - your AI-powered code companion that transforms how you understand, explore, and collaborate with code.

## 📚 Documentation Structure

### Getting Started
- [Quick Start Guide](./quick-start.md) - Get up and running in minutes
- [Installation](./installation.md) - Detailed setup instructions
- [Configuration](./configuration.md) - Environment and service configuration

### User Guides
- [Chat with Code](./guides/chat-guide.md) - Learn how to have conversations with your codebase
- [Diagram Generation](./guides/diagram-guide.md) - Create beautiful code visualizations
- [Repository Setup](./guides/repository-setup.md) - Connect and analyze your repositories
- [Advanced Features](./guides/advanced-features.md) - Explore powerful capabilities

### API Reference
- [API Overview](./api/overview.md) - Introduction to CodeBuddy APIs
- [Authentication](./api/authentication.md) - Security and access patterns
- [Chat API](./api/chat.md) - Conversational code analysis endpoints
- [Diagram API](./api/diagrams.md) - Code visualization endpoints
- [Tools API](./api/tools.md) - Repository processing and utilities
- [User Management](./api/users.md) - User operations and management

### Development
- [Architecture](./development/architecture.md) - System design and components
- [Frontend Development](./development/frontend.md) - Next.js application development
- [Backend Development](./development/backend.md) - FastAPI service development
- [AI Integration](./development/ai-integration.md) - Multi-agent AI system details
- [Contributing](./development/contributing.md) - How to contribute to CodeBuddy

### Deployment
- [Docker Deployment](./deployment/docker.md) - Containerized deployment guide
- [Production Setup](./deployment/production.md) - Enterprise deployment considerations
- [Monitoring](./deployment/monitoring.md) - Observability and health checks
- [Troubleshooting](./deployment/troubleshooting.md) - Common issues and solutions

### Examples
- [Use Cases](./examples/use-cases.md) - Real-world applications
- [Code Samples](./examples/code-samples.md) - Integration examples
- [Tutorials](./examples/tutorials.md) - Step-by-step walkthroughs

---

## 🚀 Quick Navigation

**New to CodeBuddy?** Start with our [Quick Start Guide](./quick-start.md)

**Integrating with CodeBuddy?** Check out our [API Reference](./api/overview.md)

**Want to contribute?** Read our [Contributing Guide](./development/contributing.md)

**Need help?** Visit our [Troubleshooting](./deployment/troubleshooting.md) section

---

## 📖 What is CodeBuddy?

CodeBuddy is an intelligent code analysis platform that bridges the gap between developers and their codebases through:

- **🤖 Conversational AI** - Chat naturally with your code
- **📊 Visual Diagrams** - Auto-generate beautiful code visualizations  
- **🔍 Smart Search** - Find code using natural language
- **🛡️ Enterprise Security** - Built with security-first principles

### Core Features

| Feature | Description |
|---------|-------------|
| **Chat Interface** | Ask questions about your code in natural language |
| **Diagram Generation** | Create Mermaid diagrams from code structure |
| **Repository Analysis** | Deep analysis of GitHub repositories |
| **Multi-language Support** | Python, JavaScript, TypeScript, Java, Go, C++, C# |
| **Vector Search** | Semantic code search using embeddings |
| **Real-time Processing** | Background analysis with live updates |

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    Frontend[Next.js Frontend] --> API[FastAPI Backend]
    API --> AI[Multi-Agent AI System]
    API --> DB[(MongoDB)]
    API --> Cache[(Redis)]
    API --> Queue[Celery Workers]
    API --> GitHub[GitHub Integration]
    
    AI --> LLM[Large Language Models]
    AI --> Embeddings[Vector Embeddings]
    
    Queue --> Processing[Code Analysis]
    Queue --> Diagrams[Diagram Generation]
```

---

## 🤝 Community & Support

- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Comprehensive guides and API reference
- **Examples** - Real-world use cases and tutorials

---

*Ready to transform how you work with code? Let's get started!* 🚀