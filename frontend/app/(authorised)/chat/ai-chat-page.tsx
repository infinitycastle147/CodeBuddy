"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Info,
  Bot,
  User,
  Copy,
  MoreVertical,
  Paperclip,
  Mic,
  Settings,
  Sparkles,
  Clock,
  Code,
  GitBranch,
  Ticket,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  feedback?: "positive" | "negative" | null
  context?: string[]
}

function MessageBubble({
  message,
  onFeedback,
}: { message: Message; onFeedback: (id: string, type: "positive" | "negative") => void }) {
  const isUser = message.type === "user"
  const [showActions, setShowActions] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} group`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
          }`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

          {message.context && message.context.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {message.context.map((ctx) => (
                <Badge key={ctx} variant="secondary" className="text-xs">
                  {ctx}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>

          {(showActions || message.feedback) && !isUser && (
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onFeedback(message.id, "positive")}
                    >
                      <ThumbsUp className={`w-3 h-3 ${message.feedback === "positive" ? "text-green-600" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onFeedback(message.id, "negative")}
                    >
                      <ThumbsDown className={`w-3 h-3 ${message.feedback === "negative" ? "text-red-600" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Not helpful</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyToClipboard}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy message</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Regenerate response</DropdownMenuItem>
                  <DropdownMenuItem>Report issue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}

function ChatHistory({ messages, isTyping, onFeedback }: {
  messages: Message[];
  isTyping: boolean;
  onFeedback: (messageId: string, feedbackType: "positive" | "negative") => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <Card className="flex-1 flex flex-col">
      <CardContent className="flex-1 p-0">
        <div className="h-full overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && !isTyping ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Start a conversation</h3>
                  <p className="text-muted-foreground">
                    Ask me anything about your code, project structure, or development workflow.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onFeedback={onFeedback} />
              ))}
              {isTyping && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
    </Card>
  )
}

function ContextPanel() {
  const contextItems = [
    { icon: <Code className="w-4 h-4" />, label: "Code Analysis", status: "active" },
    { icon: <GitBranch className="w-4 h-4" />, label: "Current Branch", status: "active", detail: "feature/auth" },
    { icon: <Ticket className="w-4 h-4" />, label: "Active Ticket", status: "active", detail: "AUTH-123" },
    { icon: <FileText className="w-4 h-4" />, label: "Recent Commits", status: "active", detail: "3 commits" },
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

function ChatInputArea({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your code, project, or workflow..."
              className="min-h-[60px] max-h-[120px] resize-none pr-24 text-sm"
              rows={1}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 ${isRecording ? "text-red-500" : ""}`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Voice input</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            <Button type="submit" disabled={!message.trim()} className="h-9">
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFeedback = (messageId: string, feedbackType: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: msg.feedback === feedbackType ? null : feedbackType } : msg,
      ),
    )
  }

  const addMessage = async (content: string) => {
    setError(null)
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setIsTyping(true)
    try {
      const response = await fetch("http://localhost:8000/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: content }),
      })
      if (!response.ok) throw new Error("Failed to get response from AI assistant.")
      const data = await response.json()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.result || "Sorry, I couldn't understand that.",
        timestamp: new Date(),
        context: ["ai"],
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
          timestamp: new Date(),
          context: ["error"],
        },
      ])
      setError("Failed to get response from AI assistant.")
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Intelligent code and project assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-6 overflow-scroll min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <ChatHistory messages={messages} isTyping={isTyping} onFeedback={handleFeedback} />
          <ChatInputArea onSendMessage={addMessage} />
        </div>

        {/* Context Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ContextPanel />
        </div>
      </div>
    </div>
  )
}
