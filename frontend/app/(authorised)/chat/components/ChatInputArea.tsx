"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Mic, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInputArea({ onSendMessage, disabled = false }: ChatInputAreaProps) {
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
              placeholder={disabled ? "Creating new chat..." : "Ask a question about your code, project, or workflow..."}
              className="min-h-[60px] max-h-[120px] resize-none pr-24 text-sm border-dashed"
              rows={1}
              disabled={disabled}
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
            <Button type="submit" disabled={disabled || !message.trim()} className="h-9">
              <Send className="w-4 h-4 mr-1" />
              {disabled ? 'Please wait...' : 'Send'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
