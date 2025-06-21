'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/custom-components/app-sidebar";
import { UserProvider, useUser } from "@/app/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function AuthorizedLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

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

  const role = "backend"; // You can derive this from user data if needed

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar role={role} />
        <main className="flex-1 overflow-auto">{children}</main>
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
