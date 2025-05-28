import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { GitBranch, FolderOpen, Bell } from "lucide-react"

interface TopBarProps {
  role: string
  isDemo?: boolean
}

export function TopBar({ role, isDemo }: TopBarProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <SidebarTrigger />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="w-4 h-4" />
          <span>ecommerce-platform</span>
          <span>/</span>
          <span>src</span>
          <span>/</span>
          <span>components</span>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {isDemo && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Demo Mode
            </Badge>
          )}

          <Select defaultValue="main">
            <SelectTrigger className="w-32">
              <GitBranch className="w-4 h-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">main</SelectItem>
              <SelectItem value="develop">develop</SelectItem>
              <SelectItem value="feature/auth">feature/auth</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
