export interface UserCredentials {
  github_username: string;
  github_token: string;
  jira_username?: string;
  jira_apiToken?: string;
  jira_project_name?: string;
  jira_url?: string;
}

export function getStoredCredentials(): UserCredentials | null {

  const github_username = localStorage.getItem('github_username');
  const github_token = localStorage.getItem('github_token');

  if (!github_username || !github_token) {
    return null;
  }

  return {
    github_username,
    github_token,
    jira_username: localStorage.getItem('jira_username') || undefined,
    jira_apiToken: localStorage.getItem('jira_apiToken') || undefined,
    jira_project_name: localStorage.getItem('jira_project_name') || undefined,
    jira_url: localStorage.getItem('jira_url') || undefined,
  };
}

export function setStoredCredentials(credentials: UserCredentials): void {

  localStorage.setItem('github_username', credentials.github_username);
  localStorage.setItem('github_token', credentials.github_token);
  
  if (credentials.jira_username) {
    localStorage.setItem('jira_username', credentials.jira_username);
  }
  if (credentials.jira_apiToken) {
    localStorage.setItem('jira_apiToken', credentials.jira_apiToken);
  }
  if (credentials.jira_project_name) {
    localStorage.setItem('jira_project_name', credentials.jira_project_name);
  }
  if (credentials.jira_url) {
    localStorage.setItem('jira_url', credentials.jira_url);
  }
}

export function clearStoredCredentials(): void {

  localStorage.removeItem('github_username');
  localStorage.removeItem('github_token');
  localStorage.removeItem('jira_username');
  localStorage.removeItem('jira_apiToken');
  localStorage.removeItem('jira_project_name');
  localStorage.removeItem('jira_url');
}