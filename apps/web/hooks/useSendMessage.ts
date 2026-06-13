"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";

export function useSendMessage(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: {
      conversationId: string;
      content: string;
    }) => api("/api/messages", {
      method: "POST",

      body: JSON.stringify({
        conversationId,
        content,
      }),
    }),

    onSuccess(_, variables){
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
