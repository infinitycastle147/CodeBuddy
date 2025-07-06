import { useState, useEffect } from 'react';
import { getStoredCredentials } from '@/lib/credentials';

export interface CredentialRequirement {
  github: boolean;
  jira: boolean;
  aiModel: boolean;
}

export interface CredentialStatus {
  hasGithub: boolean;
  hasJira: boolean;
  hasAiModel: boolean;
  isSetupComplete: boolean;
  missingCredentials: string[];
}

export interface CredentialCheckResult {
  status: CredentialStatus;
  showSetupDialog: boolean;
  dismissDialog: () => void;
  resetDismissal: () => void;
}

const DISMISSAL_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
// For developers: Change this to adjust dismissal duration
// Examples:
// 1 * 60 * 1000 = 1 minute
// 5 * 60 * 1000 = 5 minutes
// 10 * 60 * 1000 = 10 minutes
// 60 * 60 * 1000 = 1 hour
// 24 * 60 * 60 * 1000 = 24 hours

export function useCredentialCheck(requirements: CredentialRequirement): CredentialCheckResult {
  const [showSetupDialog, setShowSetupDialog] = useState(false);

  const checkCredentials = (): CredentialStatus => {
    
    const credentials = getStoredCredentials();
    
    const hasGithub = !!(credentials?.github_username && credentials?.github_token);
    const hasJira = !!(credentials?.jira_url && credentials?.jira_username && credentials?.jira_apiToken);
    const hasAiModel = !!(credentials?.ai_model_name && credentials?.ai_model_token);


    const missingCredentials: string[] = [];
    
    if (requirements.github && !hasGithub) {
      missingCredentials.push('GitHub');
    }
    if (requirements.jira && !hasJira) {
      missingCredentials.push('Jira');
    }
    if (requirements.aiModel && !hasAiModel) {
      missingCredentials.push('AI Model');
    }

    const isSetupComplete = missingCredentials.length === 0;

    return {
      hasGithub,
      hasJira,
      hasAiModel,
      isSetupComplete,
      missingCredentials
    };
  };

  const getDismissalKey = (missing: string[]) => {
    return `setup-dialog-dismissed-${missing.join('-').toLowerCase()}`;
  };

  const isDialogDismissed = (missingCredentials: string[]): boolean => {
    if (missingCredentials.length === 0) {
      return true;
    }
    
    const dismissalKey = getDismissalKey(missingCredentials);
    
    const dismissedAt = localStorage.getItem(dismissalKey);
    
    if (!dismissedAt) {
      return false;
    }
    
    const dismissedTime = parseInt(dismissedAt, 10);
    const now = Date.now();
    const isDismissed = (now - dismissedTime) < DISMISSAL_DURATION;
    
    
    return isDismissed;
  };

  const dismissDialog = () => {
    const status = checkCredentials();
    if (status.missingCredentials.length > 0) {
      const dismissalKey = getDismissalKey(status.missingCredentials);
      localStorage.setItem(dismissalKey, Date.now().toString());
    }
    setShowSetupDialog(false);
  };

  const resetDismissal = () => {
    const status = checkCredentials();
    if (status.missingCredentials.length > 0) {
      const dismissalKey = getDismissalKey(status.missingCredentials);
      localStorage.removeItem(dismissalKey);
    }
  };

  useEffect(() => {
    const status = checkCredentials();
    const shouldShowDialog = !status.isSetupComplete && !isDialogDismissed(status.missingCredentials);
    setShowSetupDialog(shouldShowDialog);
  }, []);

  const status = checkCredentials();
  
  return {
    status,
    showSetupDialog,
    dismissDialog,
    resetDismissal
  };
}