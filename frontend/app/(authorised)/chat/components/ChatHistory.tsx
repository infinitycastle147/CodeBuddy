"use client"

import { useRef, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import MessageBubble from "@/app/(authorised)/chat/components/MessageBubble"
import TypingIndicator from "@/app/(authorised)/chat/components/TypingIndicator"
import type { Message } from "@/app/(authorised)/chat/components/types"

interface ChatHistoryProps {
  messages: Message[]
  isTyping: boolean
  onFeedback: (messageId: string, feedbackType: "positive" | "negative") => void
  hasActiveChat?: boolean
}

export default function ChatHistory({ messages, isTyping, onFeedback, hasActiveChat = false }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  return (
    <Card className="h-full flex flex-col border-0 shadow-sm">
      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full overflow-y-auto p-6">
          {messages.length === 0 && !isTyping ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4 max-w-md">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {hasActiveChat ? "Ready to chat!" : "Create a new chat to start"}
                  </h3>
                  <p className="text-muted-foreground">
                    {hasActiveChat 
                      ? "Ask me anything about your code, project structure, or development workflow."
                      : "Click 'New Chat' above or start typing to create your first chat session."
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onFeedback={onFeedback} />
              ))}
              {isTyping && <TypingIndicator key="typing-indicator" />}
              <div key="scroll-anchor" ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
