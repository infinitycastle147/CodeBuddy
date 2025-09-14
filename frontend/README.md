# CodeBuddy Frontend

A Next.js 15 application for code analysis and collaboration with AI chat, code exploration, and diagram generation features.

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
```bash
# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Database
MONGODB_URI="mongodb://localhost:27017/codebuddy"

# GitHub OAuth (optional)
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build & Deploy

```bash
npm run build
npm start
```

## Architecture

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v4 with MongoDB adapter
- **Database**: MongoDB with Mongoose ODM
- **UI**: Shadcn/ui + Tailwind CSS + Custom animate-ui components
- **Code Editor**: Monaco Editor
- **Diagrams**: Mermaid

## Development Guidelines

### Commit Message Format

Follow conventional commits with this structure:

```
<type>: <description>

<detailed explanation>
- Bullet points for specific changes
- Include technical details
- Reference breaking changes

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Formatting changes
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```
fix: modernize NextAuth configuration for proper authentication flow

- Update environment variables to use standard NextAuth naming (NEXTAUTH_SECRET, AUTH_GITHUB_ID)
- Add MongoDB adapter for proper session and user data persistence
- Fix JWT and session callbacks with correct type mapping (user.id vs user._id)
- Improve credentials provider with single identifier field for email/username

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Code Standards

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages
- Include tests for new features

### Project Structure

```
app/
├── (public)/          # Unauthenticated routes
├── (authorised)/      # Protected routes with sidebar
├── api/              # API routes
├── context/          # React contexts
└── types/            # TypeScript declarations

components/
├── ui/               # Shadcn/ui components
├── animate-ui/       # Custom animated components
└── custom-components/ # Project-specific components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication

The app uses NextAuth.js with:
- MongoDB adapter for session persistence
- Credentials provider (email/username + password)
- GitHub OAuth provider
- Protected route middleware
- JWT-based sessions

## Contributing

1. Follow the commit message format above
2. Ensure TypeScript compilation passes
3. Run linting before committing
4. Test authentication flow after changes
5. Update documentation as needed