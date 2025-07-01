'use client'

import React from 'react'
import { 
  useHealthCheck, 
  useDiagrams, 
  useCreateDiagram,
  useSetupRepo 
} from '@/hooks/api-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ApiExample() {
  const [repoUrl, setRepoUrl] = React.useState('')
  const [diagramInput, setDiagramInput] = React.useState('')

  // Query hooks
  const { data: health, isLoading: healthLoading } = useHealthCheck()
  const { data: diagrams, isLoading: diagramsLoading, refetch: refetchDiagrams } = useDiagrams()

  // Mutation hooks
  const createDiagramMutation = useCreateDiagram()
  const setupRepoMutation = useSetupRepo()

  const handleCreateDiagram = () => {
    if (diagramInput.trim()) {
      createDiagramMutation.mutate({
        user_input: diagramInput,
        title: 'Example Diagram',
        type: 'flowchart',
      })
      setDiagramInput('')
    }
  }

  const handleSetupRepo = () => {
    if (repoUrl.trim()) {
      setupRepoMutation.mutate({ repo_url: repoUrl })
      setRepoUrl('')
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>API Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Check */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Health Check</h3>
            {healthLoading && <p>Checking health...</p>}
            {health && <p className="text-green-500">API is healthy: {health.status}</p>}
          </div>

          {/* Diagrams */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Diagrams</h3>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter diagram description"
                value={diagramInput}
                onChange={(e) => setDiagramInput(e.target.value)}
              />
              <Button 
                onClick={handleCreateDiagram}
                disabled={createDiagramMutation.isPending}
              >
                {createDiagramMutation.isPending ? 'Creating...' : 'Create Diagram'}
              </Button>
            </div>
            
            {diagramsLoading && <p>Loading diagrams...</p>}
            {diagrams && (
              <div>
                <p>{diagrams.length} diagrams found</p>
                <Button onClick={() => refetchDiagrams()} size="sm" variant="outline">
                  Refresh
                </Button>
              </div>
            )}
          </div>

          {/* Repository Setup */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Repository Setup</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
              />
              <Button 
                onClick={handleSetupRepo}
                disabled={setupRepoMutation.isPending}
              >
                {setupRepoMutation.isPending ? 'Setting up...' : 'Setup Repo'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}