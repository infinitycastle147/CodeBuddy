"use client";

import { useState } from "react";
import { MessageCircle, Plus, Trash2, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  messageCount: number;
  isActive?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isCreatingChat?: boolean;
}

export default function ChatList({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  isCreatingChat = false,
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="h-full border-0 shadow-sm bg-muted/20 flex flex-col">
        <CardHeader className="pb-3 pt-4 px-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Conversations
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {chats.length}
            </Badge>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 bg-background/50"
            />
          </div>

          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            disabled={isCreatingChat}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            {isCreatingChat ? "Creating..." : "New Conversation"}
          </Button>
        </CardHeader>

        <CardContent className="p-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-1 px-3 py-2">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {searchTerm ? "No conversations found" : "No conversations yet"}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Start a new conversation to get going"}
                </p>
              </div>
            ) : (
              filteredChats.map((chat, index) => (
                <div key={chat.id}>
                  <div
                    className={cn(
                      "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                      "hover:bg-background/80 border border-transparent",
                      currentChatId === chat.id
                        ? "bg-primary/10 border-primary/20 shadow-sm"
                        : "hover:border-border/50"
                    )}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3
                            className={cn(
                              "font-medium text-sm leading-tight",
                              currentChatId === chat.id
                                ? "text-primary"
                                : "text-foreground"
                            )}
                          >
                            {truncateText(chat.title, 20)}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs px-1.5 py-0.5 shrink-0 ml-2",
                              currentChatId === chat.id
                                ? "border-primary/30 text-primary bg-primary/5"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {chat.messageCount}
                          </Badge>
                        </div>
                        
                        {chat.lastMessage && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2 pr-8">
                            {truncateText(chat.lastMessage, 50)}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(chat.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(chat.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {currentChatId === chat.id && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-primary rounded-r" />
                    )}
                  </div>
                  
                  {index < filteredChats.length - 1 && (
                    <Separator className="my-1 mx-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
    </div>
  );
}