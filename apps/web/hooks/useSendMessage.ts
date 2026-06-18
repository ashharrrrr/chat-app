"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { api } from "@/lib/api";

import type { ChatSocketMessage } from "@chat/shared-types";
import type { Message } from "@chat/shared-types";

type MutationContext = {
  previousMessages?: Message[];
};

type SendMessageVariables = {
  conversationId: string;
  content: string;
}

export function useSendMessage(){
  const queryClient = useQueryClient();

  return useMutation<ChatSocketMessage, Error, SendMessageVariables, MutationContext>({
    mutationFn: (data) => api<ChatSocketMessage>("/api/messages", {
      method: "POST",

      body: JSON.stringify(data),
    }),

    async onMutate( variables ) {
      await queryClient.cancelQueries({
        queryKey: [
          "messages",
          variables.conversationId,
        ],
      });

      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        variables.conversationId,
      ]);

      const optimisticMessage = {
        _id: crypto.randomUUID(),

        content: variables.content,

        createdAt: new Date().toISOString(),

        optimistic: true,

        senderId: {
          _id: "optimistic",

          username: "You",
        },
      };

      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: typeof previousMessages | undefined ) => [...((old as Message[]) ?? []), optimisticMessage ]);

      return { previousMessages };
    },

    onSuccess(_message, variables){
      queryClient.invalidateQueries({
        queryKey:["messages", variables.conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

    onError(error, variables, context){
      queryClient.setQueryData(
        ["messages", variables.conversationId], 
        context?.previousMessages
      );
      toast.error(error.message);
    },
  });
}
