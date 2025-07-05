"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  Home,
  FileText,
  MessageCircle,
  GitBranchPlus,
  Code2Icon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

interface AppSidebarProps {
  role: string;
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
};

interface NavigationItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    icon: <Home className="w-4 h-4" />,
    label: "Insights",
    isActive: true,
  },
  {
    href: "/diagrams",
    icon: <GitBranchPlus className="w-4 h-4" />,
    label: "Diagrams",
  },
  // {
  //   href: "/explorer",
  //   icon: <FileText className="w-4 h-4" />,
  //   label: "Files",
  //   badge: "12",
  // },
  {
    href: "/chat",
    icon: <MessageCircle className="w-4 h-4" />,
    label: "Chat",
    badge: "3",
  },
  // {
  //   href: "/settings",
  //   icon: <Settings className="w-4 h-4" />,
  //   label: "Settings",
  // },
];

export function AppSidebar({ role }: AppSidebarProps) {
  const config =
    roleConfig[role as keyof typeof roleConfig] || roleConfig.backend;
  const router = useRouter();
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState<string>(pathname);
  const { user } = useUser();

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader
        className="border-b border-border p-6 cursor-pointer"
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Code2Icon className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Code Buddy</span>
            <span className="text-xs text-muted-foreground">
              {config.name} <span className={config.color}>{config.icon}</span>
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={activeHref === item.href}
                className="w-full justify-start h-10 px-3 rounded-lg transition-all duration-200 hover:bg-accent/50"
              >
                <a
                  href={item.href}
                  className="flex items-center gap-3"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveHref(item.href);
                    router.push(item.href);
                  }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center gap-3 text-sm">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || undefined} alt={user?.username} />
            <AvatarFallback className="text-xs">
              {user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium truncate">
              {user?.name || user?.username}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              @{user?.username}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
