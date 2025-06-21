"use client"

import type React from "react"
import { useUser } from "@/app/context/UserContext"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  FileText,
  Settings,
  Search,
  Bell,
  User,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Calendar,
  ChevronRight,
  HomeIcon,
} from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem} from "@/components/ui/breadcrumb"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

function TopbarNavigation() {
  const { user } = useUser();
  
  return (
    <header className="flex items-center justify-between w-full h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="flex items-center gap-3">  
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <HomeIcon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl text-black font-bold leading-tight">Dashboard</h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Welcome back, {user?.name || user?.username}! Here&apos;s your project overview.
                </p>
              </div>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 w-64 bg-background/50 border-border/50 focus:bg-background" />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ReactNode
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  }[changeType]

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-xs ${changeColor} flex items-center gap-1`}>
              <TrendingUp className="w-3 h-3" />
              {change}
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  const activities = [
    { id: 1, action: "New file uploaded", time: "2 minutes ago", user: "John Doe" },
    { id: 2, action: "Dashboard updated", time: "15 minutes ago", user: "Jane Smith" },
    { id: 3, action: "Report generated", time: "1 hour ago", user: "Mike Johnson" },
    { id: 4, action: "Settings modified", time: "2 hours ago", user: "Sarah Wilson" },
  ]

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  const actions = [
    { label: "Create Report", icon: <FileText className="w-4 h-4" /> },
    { label: "Schedule Meeting", icon: <Calendar className="w-4 h-4" /> },
    { label: "View Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Manage Users", icon: <Users className="w-4 h-4" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RoleDashboardMainPanel() {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value="$45,231"
            change="+20.1% from last month"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatCard
            title="Active Users"
            value="2,350"
            change="+180.1% from last month"
            changeType="positive"
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Performance"
            value="98.5%"
            change="+2.5% from last month"
            changeType="positive"
            icon={<Activity className="w-6 h-6" />}
          />
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            change="-0.5% from last month"
            changeType="negative"
            icon={<TrendingUp className="w-6 h-6" />}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Status</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Status</span>
                    <Badge variant="secondary">Maintenance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <TopbarNavigation />
      <RoleDashboardMainPanel />
    </div>
  )
}
