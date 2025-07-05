"use client"

import type React from "react"
import { useUser } from "@/app/context/UserContext"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  HomeIcon,
} from "lucide-react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import WelcomePage from "@/app/(authorised)/dashboard/components/WelcomePage"

function TopbarNavigation() {
  const { user } = useUser();

  const profilePicInitials = user?.name?.split(" ")?.map((n) => n[0])?.join("") || user?.username?.[0];

  const username = user?.name?.split(" ")?.[0] || user?.username;
  
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
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-10 w-64 bg-background/50 border-border/50 focus:bg-background" />
        </div> */}

        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button> */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt="User" />
                <AvatarFallback>{profilePicInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem> */}
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





export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <TopbarNavigation />
      <WelcomePage />
    </div>
  )
}
