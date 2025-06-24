# React Query API Integration

This document describes the robust data fetching and error handling system implemented with React Query and shadcn/ui toast notifications.

## Overview

The system provides:
- **React Query** for powerful data fetching, caching, and state management
- **Centralized error handling** with user-friendly toast notifications
- **Optimistic updates** for better UX
- **Type-safe API endpoints** with proper TypeScript definitions
- **Automatic retry logic** with smart error handling

## Key Files

- `lib/api-client.ts` - HTTP client with error handling
- `lib/api-endpoints.ts` - API endpoint definitions and types
- `hooks/api-hooks.ts` - React Query hooks for data fetching
- `app/context/QueryProvider.tsx` - React Query provider setup
- `components/examples/ApiExample.tsx` - Usage examples

## Usage Examples

### 1. Basic Data Fetching

```tsx
import { useHealthCheck, useDiagrams } from '@/hooks/api-hooks'

function MyComponent() {
  const { data: health, isLoading, error } = useHealthCheck()
  const { data: diagrams, isLoading: diagramsLoading } = useDiagrams()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error occurred</div> // Toast will show automatically

  return (
    <div>
      <p>API Health: {health?.status}</p>
      <p>Diagrams: {diagrams?.length}</p>
    </div>
  )
}
```

### 2. Mutations with Optimistic Updates

```tsx
import { useCreateDiagram, useUpdateDiagram } from '@/hooks/api-hooks'

function DiagramManager() {
  const createDiagram = useCreateDiagram()
  const updateDiagram = useUpdateDiagram()

  const handleCreate = () => {
    createDiagram.mutate({
      user_input: 'Create a flowchart',
      title: 'My Diagram'
    })
    // Success/error toasts will show automatically
    // Diagram list will be automatically refreshed
  }

  const handleUpdate = (diagramId: string, content: string) => {
    updateDiagram.mutate({ diagramId, content })
    // Optimistic update - UI updates immediately
    // Rollback happens automatically if request fails
  }

  return (
    <div>
      <button 
        onClick={handleCreate}
        disabled={createDiagram.isPending}
      >
        {createDiagram.isPending ? 'Creating...' : 'Create Diagram'}
      </button>
    </div>
  )
}
```

### 3. Real-time Task Status Polling

```tsx
import { useSetupRepo, useTaskStatus } from '@/hooks/api-hooks'

function RepoSetup() {
  const [taskId, setTaskId] = useState<string | null>(null)
  const setupRepo = useSetupRepo()
  const { data: taskStatus } = useTaskStatus(taskId!, !!taskId)

  const handleSetup = async () => {
    setupRepo.mutate(
      { repo_url: 'https://github.com/user/repo' },
      {
        onSuccess: (data) => {
          setTaskId(data.task_id) // Start polling
        }
      }
    )
  }

  return (
    <div>
      <button onClick={handleSetup}>Setup Repository</button>
      {taskStatus && (
        <div>
          Status: {taskStatus.status}
          {taskStatus.status === 'success' && <p>Setup complete!</p>}
          {taskStatus.status === 'failure' && <p>Setup failed: {taskStatus.error}</p>}
        </div>
      )}
    </div>
  )
}
```

### 4. Custom Error Handling

```tsx
import { useCustomQuery, useCustomMutation } from '@/hooks/api-hooks'

function CustomComponent() {
  // Custom query with specific error handling
  const { data } = useCustomQuery(
    ['custom-data'],
    () => fetch('/api/custom').then(res => res.json()),
    {
      onError: (error) => {
        // Custom error handling logic
        console.error('Custom error handling:', error)
      }
    }
  )

  // Custom mutation
  const mutation = useCustomMutation(
    (data: any) => fetch('/api/custom', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    {
      onSuccess: () => {
        // Custom success logic
      }
    }
  )

  return <div>Custom component</div>
}
```

## Error Handling Features

### Automatic Toast Notifications
- **Success messages** for successful mutations
- **Error messages** with specific details
- **Network error** handling with user-friendly messages
- **API error** parsing with status codes

### Smart Retry Logic
- **No retries** on 4xx client errors
- **Exponential backoff** for server errors
- **Network failure** retries
- **Query-specific** retry configuration

### Error Types
```tsx
// API errors are automatically parsed
try {
  await api.getUser('invalid-id')
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status)    // 404
    console.log(error.data)      // API response data
    console.log(error.message)   // User-friendly message
  }
}
```

## Environment Configuration

Set your API base URL in environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Available Hooks

### Queries
- `useHealthCheck()` - API health status
- `useDiagrams()` - List all diagrams
- `useDiagram(id)` - Get specific diagram
- `useUsers()` - List all users
- `useUser(id)` - Get specific user
- `useUserByEmail(email)` - Get user by email
- `useTaskStatus(taskId)` - Poll task status

### Mutations
- `useCreateChat()` - Create new chat
- `useAddMessage()` - Add message to chat
- `useCreateDiagram()` - Create new diagram
- `useUpdateDiagram()` - Update diagram content
- `useCreateUser()` - Create new user
- `useSetupRepo()` - Setup repository

### Utilities
- `useCustomQuery()` - Generic query hook
- `useCustomMutation()` - Generic mutation hook

## Best Practices

1. **Use specific hooks** instead of generic ones when available
2. **Handle loading states** in your UI
3. **Trust the error handling** - toasts will show automatically
4. **Use optimistic updates** for better UX
5. **Configure retry logic** based on your use case
6. **Type your API responses** properly

## React Query DevTools

Development tools are automatically included and can be toggled in development mode.