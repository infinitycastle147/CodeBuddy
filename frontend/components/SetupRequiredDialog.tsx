"use client";

import { useRouter } from 'next/navigation';
import { Settings, Github, Brain, AlertCircle, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SetupRequiredDialogProps {
  open: boolean;
  missingCredentials: string[];
  featureName: string;
}

export default function SetupRequiredDialog({
  open,
  missingCredentials,
  featureName,
}: SetupRequiredDialogProps) {
  const router = useRouter();

  const handleGoToSetup = () => {
    router.push('/setup');
  };


  const getCredentialIcon = (credential: string) => {
    switch (credential.toLowerCase()) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'jira':
        return <Settings className="w-4 h-4" />;
      case 'ai model':
        return <Brain className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCredentialDescription = (credential: string) => {
    switch (credential.toLowerCase()) {
      case 'github':
        return 'Required for accessing repositories and code analysis';
      case 'jira':
        return 'Optional for project management and issue tracking';
      case 'ai model':
        return 'Optional for enhanced AI-powered features';
      default:
        return 'Required for this feature to work properly';
    }
  };

  const isGithubMissing = missingCredentials.some(cred => cred.toLowerCase() === 'github');

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-left">Setup Required</DialogTitle>
              <DialogDescription className="text-left">
                {featureName} needs additional configuration to work properly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              {isGithubMissing ? (
                <strong>GitHub credentials are required</strong>
              ) : (
                <strong>Additional setup needed</strong>
              )} to access {featureName.toLowerCase()}.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Missing Configuration:</h4>
            <div className="space-y-2">
              {missingCredentials.map((credential) => (
                <div key={credential} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {getCredentialIcon(credential)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{credential}</span>
                      <Badge variant={credential.toLowerCase() === 'github' ? 'destructive' : 'secondary'} className="text-xs">
                        {credential.toLowerCase() === 'github' ? 'Required' : 'Optional'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getCredentialDescription(credential)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">Quick Setup</h4>
                <p className="text-sm text-blue-800 mt-1">
                  The setup process takes less than 5 minutes and all your credentials are stored securely in your browser.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleGoToSetup}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <span>Complete Setup</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}