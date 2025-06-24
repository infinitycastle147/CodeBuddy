import { Info, Code, GitBranch, Ticket, FileText, MessageSquare, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContextPanelProps {
  currentChatId?: string | null
  messageCount?: number
  isConnected?: boolean
}

export default function ContextPanel({ currentChatId, messageCount = 0 }: ContextPanelProps) {
  const contextItems = [
    {
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Chat Session",
      status: currentChatId ? "active" : "inactive",
      detail: currentChatId ? `ID: ${currentChatId.slice(0, 8)}...` : "No session",
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Messages",
      status: messageCount > 0 ? "active" : "inactive",
      detail: `${messageCount} messages`,
    },
    {
      icon: <Code className="w-4 h-4" />,
      label: "Code Analysis",
      status: "active",
    },
    {
      icon: <GitBranch className="w-4 h-4" />,
      label: "Current Branch",
      status: "active",
      detail: "feature/auth",
    },
    {
      icon: <Ticket className="w-4 h-4" />,
      label: "Active Ticket",
      status: "active",
      detail: "AUTH-123",
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Recent Commits",
      status: "active",
      detail: "3 commits",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="w-4 h-4" />
          Context Awareness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {contextItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.detail && <span className="text-xs text-muted-foreground">{item.detail}</span>}
              <div className={`w-2 h-2 rounded-full ${item.status === "active" ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
