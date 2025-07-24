import CryptoJS from 'crypto-js';

export interface UserCredentials {
  github_username: string;
  github_token: string;
  repo_url: string;
  jira_username?: string;
  jira_apiToken?: string;
  jira_project_name?: string;
  jira_url?: string;
  ai_model_name?: string;
  ai_model_token?: string;
}

// Generate a consistent encryption key based on user session
const getEncryptionKey = (): string => {
  // Use a combination of factors to create a session-specific key
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
  const timestamp = typeof window !== 'undefined' ? window.localStorage.getItem('session_start') : '';
  
  if (!timestamp) {
    // Set session start time if not exists
    const sessionStart = Date.now().toString();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('session_start', sessionStart);
    }
    return CryptoJS.SHA256(userAgent + sessionStart + 'codebuddy-secret').toString();
  }
  
  return CryptoJS.SHA256(userAgent + timestamp + 'codebuddy-secret').toString();
};

export function getStoredCredentials(): UserCredentials | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const encryptedData = localStorage.getItem('encrypted_credentials');
    if (!encryptedData) {
      // Try to migrate old unencrypted data
      return migrateOldCredentials();
    }

    const encryptionKey = getEncryptionKey();
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      console.warn('Failed to decrypt credentials, they may be corrupted');
      return null;
    }

    const credentials = JSON.parse(decryptedData);
    
    // Validate required fields
    if (!credentials.github_username || !credentials.github_token) {
      return null;
    }
    
    return credentials;
  } catch (error) {
    console.warn('Error retrieving encrypted credentials:', error);
    return null;
  }
}

// Migrate old unencrypted credentials to encrypted format
function migrateOldCredentials(): UserCredentials | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const github_username = localStorage.getItem('github_username');
  const github_token = localStorage.getItem('github_token');
  const repo_url = localStorage.getItem('repo_url');

  if (!github_username || !github_token) {
    return null;
  }

  const credentials: UserCredentials = {
    github_username,
    github_token,
    repo_url: repo_url || "",
    jira_username: localStorage.getItem('jira_username') || undefined,
    jira_apiToken: localStorage.getItem('jira_apiToken') || undefined,
    jira_project_name: localStorage.getItem('jira_project_name') || undefined,
    jira_url: localStorage.getItem('jira_url') || undefined,
    ai_model_name: localStorage.getItem('ai_model_name') || undefined,
    ai_model_token: localStorage.getItem('ai_model_token') || undefined,
  };

  // Store encrypted version and remove old unencrypted data
  setStoredCredentials(credentials);
  clearOldUnencryptedCredentials();
  
  return credentials;
}

function clearOldUnencryptedCredentials(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('github_username');
  localStorage.removeItem('github_token');
  localStorage.removeItem('repo_url');
  localStorage.removeItem('jira_username');
  localStorage.removeItem('jira_apiToken');
  localStorage.removeItem('jira_project_name');
  localStorage.removeItem('jira_url');
  localStorage.removeItem('ai_model_name');
  localStorage.removeItem('ai_model_token');
}

export function setStoredCredentials(credentials: UserCredentials): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const encryptionKey = getEncryptionKey();
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(credentials), encryptionKey).toString();
    
    localStorage.setItem('encrypted_credentials', encryptedData);
    
    // Remove any old unencrypted credentials that might still exist
    clearOldUnencryptedCredentials();
  } catch (error) {
    console.error('Error storing encrypted credentials:', error);
    throw new Error('Failed to securely store credentials');
  }
}

export function clearStoredCredentials(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Clear encrypted credentials
  localStorage.removeItem('encrypted_credentials');
  localStorage.removeItem('session_start');
  
  // Also clear any old unencrypted credentials for safety
  clearOldUnencryptedCredentials();
}

export function hasCompleteGitHubCredentials(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const credentials = getStoredCredentials();
  return !!(credentials?.github_username && credentials?.github_token && credentials?.repo_url);
}