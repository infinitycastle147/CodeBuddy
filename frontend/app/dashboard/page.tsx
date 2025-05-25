"use client";
import React from "react";
import { Sidebar, SidebarMenu, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { Home, BarChart, FileText, MessageCircle, Settings } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function SidebarNavigation() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuButton asChild isActive={true}>
            <a href="/dashboard"><Home className="mr-2" /> Insights</a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/diagrams"><BarChart className="mr-2" /> Diagrams</a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/explorer"><FileText className="mr-2" /> Files</a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/chat"><MessageCircle className="mr-2" /> Chat</a>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <a href="/settings"><Settings className="mr-2" /> Settings</a>
          </SidebarMenuButton>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
}

function TopbarNavigation() {
  return (
    <header className="flex items-center justify-between w-full h-16 border-b border-border bg-background px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div>{/* User/role info, actions */}</div>
    </header>
  );
}

function RoleDashboardMainPanel() {
  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Role-specific dashboard content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-lg">Role-specific dashboard content will appear here.</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <SidebarNavigation />
      <div className="flex flex-col flex-1 min-w-0">
        <TopbarNavigation />
        <RoleDashboardMainPanel />
      </div>
    </div>
  );
} 