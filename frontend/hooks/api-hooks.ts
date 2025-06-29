"use client";

import React from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  api,
  User,
  Chat,
  Diagram,
  RepoSetup,
  TaskStatus,
  Message,
} from "@/lib/api-endpoints";
import { ApiError } from "@/lib/api-client";
import { useToast } from "./use-toast";

// Query Keys
export const queryKeys = {
  health: ["health"] as const,
  chats: ["chats"] as const,
  chat: (id: string) => ["chats", id] as const,
  diagrams: ["diagrams"] as const,
  diagram: (id: string) => ["diagrams", id] as const,
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  userByEmail: (email: string) => ["users", "email", email] as const,
  taskStatus: (taskId: string) => ["tasks", taskId] as const,
};

// Custom hook for error handling
function useErrorHandler() {
  const { toast } = useToast();

  return (error: unknown, customMessage?: string) => {
    let errorMessage = customMessage || "An unexpected error occurred";

    if (error instanceof ApiError) {
      // Use the standardized error response format
      errorMessage =
        error.data?.error?.message ||
        error.message ||
        `Error ${error.status}: ${error.statusText}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
  };
}

// Success toast helper
function useSuccessHandler() {
  const { toast } = useToast();

  return (message: string, title = "Success") => {
    toast({
      title,
      description: message,
    });
  };
}

// Health Check Hooks
export function useHealthCheck() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: api.health,
    staleTime: 30000, // 30 seconds
  });
}

// Chat Hooks
export function useCreateChat() {
  const queryClient = useQueryClient();
  const showError = useErrorHandler();
  const showSuccess = useSuccessHandler();

  return useMutation({
    mutationFn: api.createChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
      showSuccess("Chat created successfully");
    },
    onError: (error) => showError(error, "Failed to create chat"),
  });
}

export function useChat(chatId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chat(chatId),
    queryFn: () => api.getChat(chatId),
    enabled: enabled && !!chatId,
  });
}

export function useAddMessage() {
  const queryClient = useQueryClient();
  const showError = useErrorHandler();

  return useMutation({
    mutationFn: ({ chatId, message }: { chatId: string; message: string }) =>
      api.addMessage(chatId, message),
    onSuccess: (data, variables) => {
      // Update the chat query with new messages
      queryClient.setQueryData<Chat>(
        queryKeys.chat(variables.chatId),
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            messages: [...oldData.messages, data.message, data.response],
          };
        }
      );
    },
    onError: (error) => showError(error, "Failed to send message"),
  });
}

// Diagram Hooks
export function useDiagrams() {
  return useQuery({
    queryKey: queryKeys.diagrams,
    queryFn: api.listDiagrams,
  });
}

export function useDiagram(diagramId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.diagram(diagramId),
    queryFn: () => api.getDiagram(diagramId),
    enabled: enabled && !!diagramId,
  });
}

export function useCreateDiagram() {
  const queryClient = useQueryClient();
  const showError = useErrorHandler();
  const showSuccess = useSuccessHandler();

  return useMutation({
    mutationFn: api.createDiagram,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diagrams });
      showSuccess("Diagram created successfully");
    },
    onError: (error) => showError(error, "Failed to create diagram"),
  });
}

export function useUpdateDiagram() {
  const queryClient = useQueryClient();
  const showError = useErrorHandler();
  const showSuccess = useSuccessHandler();

  return useMutation({
    mutationFn: ({
      diagramId,
      content,
    }: {
      diagramId: string;
      content: string;
    }) => api.updateDiagram(diagramId, content),
    onSuccess: (data, variables) => {
      // Update the specific diagram query
      queryClient.setQueryData(queryKeys.diagram(variables.diagramId), data);
      // Invalidate the diagrams list
      queryClient.invalidateQueries({ queryKey: queryKeys.diagrams });
      showSuccess("Diagram updated successfully");
    },
    onError: (error) => showError(error, "Failed to update diagram"),
  });
}

// User Hooks
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: api.listUsers,
  });
}

export function useUser(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => api.getUser(userId),
    enabled: enabled && !!userId,
  });
}

export function useUserByEmail(email: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.userByEmail(email),
    queryFn: () => api.getUserByEmail(email),
    enabled: enabled && !!email,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const showError = useErrorHandler();
  const showSuccess = useSuccessHandler();

  return useMutation({
    mutationFn: api.createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      showSuccess("User created successfully");
    },
    onError: (error) => showError(error, "Failed to create user"),
  });
}

// Repository Setup Hooks
export function useSetupRepo() {
  const showError = useErrorHandler();
  const showSuccess = useSuccessHandler();

  return useMutation({
    mutationFn: api.setupRepo,
    onSuccess: (data) => {
      showSuccess(`Repository setup initiated. Task ID: ${data.task_id}`);
    },
    onError: (error) => showError(error, "Failed to setup repository"),
  });
}

export function useTaskStatus(taskId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.taskStatus(taskId),
    queryFn: () => api.getTaskStatus(taskId),
    enabled: enabled && !!taskId,
    refetchInterval: (data) => {
      // Stop polling when task is completed or failed
      if (data && (data.status === "success" || data.status === "failure")) {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
  });
}

// Generic hooks for custom queries
export function useCustomQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useCustomMutation<T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options?: Omit<UseMutationOptions<T, unknown, V>, "mutationFn">
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}
