"use client";

import { useState } from "react";
import ChatHistory from "@/app/(authorised)/chat/components/ChatHistory";
import ContextPanel from "@/app/(authorised)/chat/components/ContextPanel";
import ChatInputArea from "@/app/(authorised)/chat/components/ChatInputArea";
import { type Message } from "@/app/(authorised)/chat/components/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Settings, AlertCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeedback = (
    messageId: string,
    feedbackType: "positive" | "negative"
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              feedback: msg.feedback === feedbackType ? null : feedbackType,
            }
          : msg
      )
    );
  };

  const addMessage = async (content: string) => {
    setError(null);
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);
    try {
      const response = await fetch("http://localhost:8000/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: content }),
      });
      if (!response.ok)
        throw new Error("Failed to get response from AI assistant.");
      const data = await response.json();
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data || "Sorry, I couldn't understand that.",
        timestamp: new Date(),
        context: ["ai"],
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          type: "assistant",
          content: "Sorry, something went wrong. Please try again later.",
          timestamp: new Date(),
          context: ["error"],
        },
      ]);
      setError("Failed to get response from AI assistant.");
    } finally {
      setIsTyping(false);
    }
  };

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
              <p className="text-xs text-muted-foreground">
                Intelligent code and project assistant
              </p>
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
          <ChatHistory
            messages={messages}
            isTyping={isTyping}
            onFeedback={handleFeedback}
          />
          <ChatInputArea onSendMessage={addMessage} />
        </div>

        {/* Context Sidebar */}
        <div className="w-80 flex-shrink-0">
          <ContextPanel />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg shadow-lg flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
    </div>
  );
}
