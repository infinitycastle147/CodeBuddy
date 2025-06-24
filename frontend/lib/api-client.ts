// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Standardized API Response Types
export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details: unknown
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: ApiErrorResponse
  ) {
    super(`API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
  }
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const responseData: ApiResponse<T> = await response.json()
      
      // Check if the response indicates success
      if (responseData.success) {
        return responseData.data
      } else {
        // Handle error response
        throw new ApiError(response.status, response.statusText, responseData)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()