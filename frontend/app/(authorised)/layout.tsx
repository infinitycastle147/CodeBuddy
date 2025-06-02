import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/custom-components/app-sidebar";

export default function Layout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    
    const role = "backend"; // Default role, can be dynamically set based on user context
    
    return (
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <AppSidebar role={role} />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
    );
    }