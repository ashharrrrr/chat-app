"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";

import type { ChatSocketMessage } from "@chat/shared-types";

type SendMessageVariables = {
  conversationId: string;
  content: string;
}

export function useSendMessage(){
  const queryClient = useQueryClient();

  return useMutation<ChatSocketMessage, Error, SendMessageVariables>({
    mutationFn: (data) => api<ChatSocketMessage>("/api/messages", {
      method: "POST",

      body: JSON.stringify(data),
    }),

    onSuccess(_message, variables){
      queryClient.invalidateQueries({
        queryKey:["messages", variables.conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

    onError(error){
      toast.error(error.message);
    },
  });
}
