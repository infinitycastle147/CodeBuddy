import { apiClient } from './api-client'

// Type definitions based on the API documentation
export interface User {
  id: string
  email: string
  name?: string
}

export interface Chat {
  id: string
  messages: Message[]
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface Diagram {
  id: string
  title?: string
  description?: string
  content: string
  created_at: string
  updated_at: string
}

export interface RepoSetup {
  repo_url: string
  access_token?: string
}

export interface TaskStatus {
  task_id: string
  status: 'pending' | 'started' | 'retry' | 'failure' | 'success'
  result?: unknown
  error?: string
}

// API endpoint functions
export const api = {
  // Health checks
  health: () => apiClient.get<{ status: string }>('/health'),
  toolsHealth: () => apiClient.get<{ status: string }>('/tools/health'),
  chatHealth: () => apiClient.get<{ status: string }>('/chat/health'),
  diagramHealth: () => apiClient.get<{ status: string }>('/diagram/health'),
  userHealth: () => apiClient.get<{ status: string }>('/user/health'),

  // Tools
  setupRepo: (data: RepoSetup) => apiClient.post<{ task_id: string }>('/tools/setup', data),
  getTaskStatus: (taskId: string) => apiClient.get<TaskStatus>(`/tools/task-status/${taskId}`),

  // Chat
  createChat: () => apiClient.post<Chat>('/chat/'),
  getChat: (chatId: string) => apiClient.get<Chat>(`/chat/${chatId}`),
  addMessage: (chatId: string, message: string) => 
    apiClient.post<{ message: Message; response: Message }>(`/chat/${chatId}/message`, { message }),

  // Diagrams
  listDiagrams: () => apiClient.get<Diagram[]>('/diagram/'),
  createDiagram: (data: { user_input: string; title?: string; description?: string }) => 
    apiClient.post<Diagram>('/diagram/', data),
  getDiagram: (diagramId: string) => apiClient.get<Diagram>(`/diagram/${diagramId}`),
  updateDiagram: (diagramId: string, content: string) => 
    apiClient.patch<Diagram>(`/diagram/${diagramId}`, { content }),

  // Users
  listUsers: () => apiClient.get<User[]>('/user/'),
  createUser: (userData: Omit<User, 'id'>) => apiClient.post<User>('/user/', userData),
  getUser: (userId: string) => apiClient.get<User>(`/user/${userId}`),
  getUserByEmail: (email: string) => apiClient.get<User>(`/user/email/${email}`),
}