"use client";
import React from "react";
import { Send, ThumbsUp, ThumbsDown, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

function ChatHistory() {
  return (
    <div className="flex-1 overflow-y-auto bg-muted rounded-lg flex items-center justify-center">
      {/* Placeholder for chat messages */}
      <div className="text-muted-foreground text-center">Chat history will appear here.</div>
    </div>
  );
}

function ChatInputBox() {
  return (
    <form className="flex gap-2 w-full">
      <input
        type="text"
        placeholder="Ask a question..."
        className="flex-1 border border-border rounded-md px-3 py-2 bg-background focus:outline-none"
      />
      <Button type="submit" variant="default"><Send /></Button>
    </form>
  );
}

function ChatFeedback() {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon"><ThumbsUp /></Button>
      <Button variant="ghost" size="icon"><ThumbsDown /></Button>
    </div>
  );
}

export default function AiChatPage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-border font-semibold text-lg"><MessageCircle /> AI Assistant</div>
      <div className="flex-1 flex flex-col gap-4 p-6">
        <ChatHistory />
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Info /> Context awareness: code, commit, branch, ticket</div>
        <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
          <ChatInputBox />
          <ChatFeedback />
        </div>
      </div>
    </div>
  );
} 