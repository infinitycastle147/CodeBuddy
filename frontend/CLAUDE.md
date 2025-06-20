# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
CodeBuddy is a Next.js 15 application using the App Router with TypeScript. It's a code analysis and collaboration platform with features including AI chat, code exploration, diagram generation, and user authentication.

## Key Commands
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application 
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Authentication & Authorization
- Uses NextAuth.js v4 for authentication
- Middleware in `app/middleware.ts` handles route protection
- AuthProvider context wraps the entire app in `app/context/AuthProvider.tsx`
- Protected routes: `/dashboard`, `/chat`, `/explorer`, `/diagrams`, `/settings`, `/profile`, `/timeline`
- Public routes: `/`, `/login`, `/register`, auth-related routes

### Route Structure
- `app/(public)/` - Unauthenticated routes (landing, login, register, setup)
- `app/(authorised)/` - Protected routes with sidebar layout
- Uses route groups with parallel routing for layout organization

### Database
- MongoDB with Mongoose ODM (`lib/dbConnect.ts`)
- User model in `app/model/user.ts`
- Zod schemas for validation in `app/schemas/`

### UI Components
- Shadcn/ui components in `components/ui/`
- Custom animate-ui components in `components/animate-ui/`
- Radix UI primitives as base components
- Tailwind CSS with CSS variables for theming
- Lucide React for icons

### Key Features
1. **AI Chat** (`app/(authorised)/chat/`) - Chat interface with message history, typing indicators, and context panels
2. **Code Explorer** (`app/(authorised)/explorer/`) - File tree navigation with Monaco editor integration
3. **Diagram Studio** (`app/(authorised)/diagrams/`) - Mermaid diagram editor and renderer
4. **Dashboard** - Main landing page for authenticated users

### State Management
- React Context for authentication (AuthProvider)
- FileExplorerContext for file operations
- React Hook Form for form handling with Zod validation

### Styling
- Tailwind CSS configuration in `tailwind.config.ts`
- CSS variables for theming in `app/globals.css`
- Geist font family (sans and mono variants)

## Important Implementation Details
- Monaco Editor for code editing with syntax highlighting
- Mermaid for diagram rendering
- React Markdown for message formatting
- Resizable panels for complex layouts
- Custom sidebar component with role-based navigation

## Development Notes
- Uses TypeScript strict mode
- ESLint configuration in `eslint.config.mjs`
- Path aliases configured in `components.json` and `tsconfig.json`
- The app expects MongoDB connection for user authentication and data persistence