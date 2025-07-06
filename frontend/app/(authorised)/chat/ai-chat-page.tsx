"use client";

// External Dependencies and React Core
import { useState, useEffect, useMemo } from "react";
import { MessageCircle, Loader2, Activity } from "lucide-react";

// Local Components
import ChatHistory from "@/app/(authorised)/chat/components/ChatHistory";
import ChatList from "@/app/(authorised)/chat/components/ChatList";
import ChatInputArea from "@/app/(authorised)/chat/components/ChatInputArea";
import { type Message } from "@/app/(authorised)/chat/components/types";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Custom Hooks
import { useCreateChat, useAddMessage, useChat, useListChats } from "@/hooks/api-hooks";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export default function AiChatPage() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  // React Query hooks - using our built infrastructure
  const createChatMutation = useCreateChat();
  const addMessageMutation = useAddMessage();
  const { data: allChats } = useListChats();
  const {
    data: chatData,
    isLoading: chatLoading,
    error: chatError,
  } = useChat(currentChatId || "", !!currentChatId);

  const isTyping = addMessageMutation.isPending;

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

  // Convert API messages to component format
  const formattedMessages = useMemo(() => {
    if (!chatData?.messages) return [];

    return chatData.messages.map(
      (msg): Message => ({
        id: msg.id,
        type: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        context: msg.role === "assistant" ? ["ai"] : undefined,
      })
    );
  }, [chatData?.messages]);

  // Update local messages when chat data changes
  useEffect(() => {
    setMessages(formattedMessages);
  }, [formattedMessages]);

  // Handle chat errors
  useEffect(() => {
    if (chatError) {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "Failed to load chat messages. Please try refreshing.",
      });
    }
  }, [chatError, toast]);

  const createNewChat = () => {
    createChatMutation.mutate(undefined, {
      onSuccess: (newChat) => {
        setCurrentChatId(newChat.id);
        setMessages([]); // Clear messages for new chat
      },
      onError: (error) => {
        console.error('Failed to create new chat:', error);
      }
    });
  };

  const addMessage = (content: string) => {
    
    // If no current chat, create one first
    if (!currentChatId) {
      createChatMutation.mutate(undefined, {
        onSuccess: (newChat) => {
          setCurrentChatId(newChat.id);
          // Then send the message
          addMessageMutation.mutate({
            chatId: newChat.id,
            message: content,
          });
        },
        onError: (error) => {
          console.error('Failed to create chat:', error);
        }
      });
    } else {
      // Send message to existing chat
      addMessageMutation.mutate({
        chatId: currentChatId,
        message: content,
      });
    }
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    // TODO: Implement delete chat functionality
    console.log('Delete chat:', chatId);
  };

  // Format chats for ChatList component
  const formattedChats = useMemo(() => {
    if (!allChats) return [];
    
    return allChats.map(chat => {
      // Safely parse the timestamp
      const timestampValue = chat.updated_at || chat.created_at;
      let timestamp = new Date();
      
      if (timestampValue) {
        const parsedDate = new Date(timestampValue);
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate;
        }
      }
      
      return {
        id: chat.id,
        title: chat.title || 'Untitled Chat',
        lastMessage: chat.messages?.[chat.messages.length - 1]?.content || 'No messages yet',
        timestamp,
        messageCount: chat.messages?.length || 0,
      };
    });
  }, [allChats]);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Enhanced Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-6 mx-auto py-4 w-full">
          <div className="flex items-center justify-between">
            {/* Left Section - Branding */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-6" />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background border-2 border-background rounded-full flex items-center justify-center">
                    <Activity className="w-2 h-2 text-green-500" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h1 className="text-lg font-semibold tracking-tight">
                    AI Assistant
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Intelligent code and project assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              <Badge
                variant={currentChatId ? "default" : "secondary"}
                className="gap-2 px-3 py-1"
              >
                {chatLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentChatId
                        ? "bg-green-500 animate-pulse"
                        : "bg-muted-foreground"
                    }`}
                  />
                )}
                <span className="text-xs font-medium">
                  {currentChatId ? "Connected" : "Ready"}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex gap-6 p-6 min-h-0 max-h-full">
          {/* Chat List Sidebar */}
          <aside className="w-80 flex-shrink-0 min-h-0 max-h-full">
            <ChatList
              chats={formattedChats}
              currentChatId={currentChatId}
              onChatSelect={handleChatSelect}
              onNewChat={createNewChat}
              onDeleteChat={handleDeleteChat}
              isCreatingChat={createChatMutation.isPending}
            />
          </aside>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
            <div className="flex-1 min-h-0">
              <ChatHistory
                messages={messages}
                isTyping={isTyping}
                onFeedback={handleFeedback}
                hasActiveChat={!!currentChatId}
              />
            </div>
            <div className="flex-shrink-0">
              <ChatInputArea
                onSendMessage={addMessage}
                disabled={createChatMutation.isPending || addMessageMutation.isPending}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Loading Toast */}
      {createChatMutation.isPending && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="p-4 shadow-lg border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium">Creating new chat</p>
                <p className="text-xs text-muted-foreground">
                  Setting up your conversation...
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
