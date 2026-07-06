"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

import type { ChatSocketMessage } from "@chat/shared-types";
import type { Message } from "@chat/shared-types";

type MutationContext = {
  previousMessages?: Message[];
  optimisticImageUrl?: string;
};

type SendMessageVariables = {
  conversationId: string;
  content: string;
  image?: File | null;
}

export function useSendMessage() {

  const queryClient = useQueryClient();

  function postMessage(data: SendMessageVariables) {
    const formData = new FormData();

    formData.append("conversationId", data.conversationId)
    formData.append("content", data.content)

    if (data.image) {
      formData.append("image", data.image);
    }

    return api<ChatSocketMessage>("/api/messages", {
      method: "POST",
      body: formData,
    },
    )
  }

  return useMutation<ChatSocketMessage, Error, SendMessageVariables, MutationContext>({
    mutationFn: postMessage,

    async onMutate(variables) {
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

      const optimisticImageUrl = variables.image ? URL.createObjectURL(variables.image) : undefined;

      const optimisticMessage: Message = {
        _id: crypto.randomUUID(),
        content: variables.content,
        createdAt: new Date().toISOString(),
        optimistic: true,
        image: optimisticImageUrl,
        senderId: {
          _id: "optimistic",
          username: "You",
        },
      };

      queryClient.setQueryData<Message[]>(
        ["messages", variables.conversationId],
        (old = []) => [...old, optimisticMessage]);

      return { previousMessages, optimisticImageUrl };
    },

    onSettled(_data, _error, variables, context) {
      if (context?.optimisticImageUrl) {
        URL.revokeObjectURL(context.optimisticImageUrl);
      }

      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },

    onError(error, variables, context) {
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        context?.previousMessages
      );
      toast.error(error.message);
    },
  });
}
