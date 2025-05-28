import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
  } from "@/components/ui/sidebar"
  import {
    BarChart3,
    FileCode,
    MessageSquare,
    Settings,
    GitBranch,
    Eye,
    BarChart3Icon as Diagram3,
    Clock,
  } from "lucide-react"
  
  interface AppSidebarProps {
    role: string
  }
  
  const roleConfig = {
    backend: {
      color: "text-blue-600",
      icon: "🧩",
      name: "Backend Engineer",
    },
    frontend: {
      color: "text-green-600",
      icon: "🎨",
      name: "Frontend Developer",
    },
    aiml: {
      color: "text-purple-600",
      icon: "🧠",
      name: "AI/ML Engineer",
    },
    pm: {
      color: "text-orange-600",
      icon: "📋",
      name: "Product Manager",
    },
  }
  
  export function AppSidebar({ role }: AppSidebarProps) {
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.backend
  
    const menuItems = [
      {
        title: "Dashboard",
        icon: BarChart3,
        url: `/dashboard?role=${role}`,
        isActive: true,
      },
      {
        title: "Code Explorer",
        icon: FileCode,
        url: `/explorer?role=${role}`,
      },
      {
        title: "Diagrams",
        icon: Diagram3,
        url: `/diagrams?role=${role}`,
      },
      {
        title: "AI Assistant",
        icon: MessageSquare,
        url: `/chat?role=${role}`,
      },
      {
        title: "Timeline",
        icon: Clock,
        url: `/timeline?role=${role}`,
      },
      {
        title: "Settings",
        icon: Settings,
        url: `/settings?role=${role}`,
      },
    ]
  
    return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">CodeLens</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>{config.icon}</span>
                {config.name}
              </p>
            </div>
          </div>
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter className="p-4">
          <div className="text-xs text-muted-foreground">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="w-3 h-3" />
              <span>main</span>
            </div>
            <div>Repository: ecommerce-platform</div>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }
  