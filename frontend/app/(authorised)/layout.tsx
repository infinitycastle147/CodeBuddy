'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/custom-components/app-sidebar";
import { UserProvider, useUser } from "@/app/context/UserContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCredentialCheck } from "@/hooks/use-credential-check";
import SetupRequiredDialog from "@/components/SetupRequiredDialog";

function AuthorizedLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  // Define which pages require credentials and what type
  const getCredentialRequirements = (path: string) => {
    if (path.startsWith('/chat')) {
      return { github: true, jira: false, aiModel: false };
    }
    if (path.startsWith('/diagrams')) {
      return { github: true, jira: false, aiModel: false };
    }
    // Add more routes as needed
    return { github: false, jira: false, aiModel: false };
  };

  const credentialRequirements = getCredentialRequirements(pathname);
  const needsCredentialCheck = credentialRequirements.github || credentialRequirements.jira || credentialRequirements.aiModel;
  
  const credentialCheck = useCredentialCheck(credentialRequirements);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const getFeatureName = (path: string) => {
    if (path.startsWith('/chat')) return 'AI Chat';
    if (path.startsWith('/diagrams')) return 'Diagram Studio';
    return 'This feature';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
        
        {/* Credential Check Dialog */}
        {needsCredentialCheck && (
          <SetupRequiredDialog
            open={credentialCheck.showSetupDialog}
            missingCredentials={credentialCheck.status.missingCredentials}
            featureName={getFeatureName(pathname)}
          />
        )}
      </div>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AuthorizedLayoutContent>
        {children}
      </AuthorizedLayoutContent>
    </UserProvider>
  );
}
