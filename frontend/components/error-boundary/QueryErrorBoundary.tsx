'use client'

import React from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ApiError } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

interface QueryErrorFallbackProps {
  error: Error
}

function QueryErrorFallback({ error }: QueryErrorFallbackProps) {
  const { toast } = useToast()

  React.useEffect(() => {
    let errorMessage = 'An unexpected error occurred'
    
    if (error instanceof ApiError) {
      errorMessage = error.data?.error?.message || `Error ${error.status}: ${error.statusText}`
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    toast({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
    })
  }, [error, toast])

  // Return null to not render anything - the toast handles the error display
  return null
}

interface QueryErrorBoundaryProps {
  children: React.ReactNode
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          FallbackComponent={QueryErrorFallback}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}