"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { api } from "@/lib/api";

export function useCreateConversation() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => api("/api/conversations", {
      method: "POST",

      body: JSON.stringify({
        username,
      }),
    }),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      toast.success("Conversation created");

    },

    onError(error) {
      toast.error(error.message);
    },
  });
}
