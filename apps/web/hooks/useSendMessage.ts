"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

import type { ChatSocketMessage } from "@chat/shared-types";

type MutationContext = {
  previousMessages?: ChatSocketMessage[];
  optimisticImageUrl?: string;
};

type SendMessageVariables = {
  conversationId: string;
  content: string;
  image?: File | null;
  clientId: string;
}

export function useSendMessage() {

  const queryClient = useQueryClient();

  function postMessage(data: SendMessageVariables) {
    const formData = new FormData();

    formData.append("conversationId", data.conversationId);
    formData.append("content", data.content);
    formData.append("clientId", data.clientId);

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

      const previousMessages = queryClient.getQueryData<ChatSocketMessage[]>([
        "messages",
        variables.conversationId,
      ]);

      const optimisticImageUrl = variables.image ? URL.createObjectURL(variables.image) : undefined;

      const optimisticMessage: ChatSocketMessage = {
        _id: variables.clientId,
        clientId: variables.clientId,

        conversationId: variables.conversationId,

        content: variables.content,
        image: optimisticImageUrl,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        optimistic: true,

        senderId: {
          _id: "optimistic",
          username: "You",
        },
      };

      queryClient.setQueryData<ChatSocketMessage[]>(
        ["messages", variables.conversationId],
        (old = []) => [...old, optimisticMessage]);

      return { previousMessages, optimisticImageUrl };
    },

    onSuccess(message, variables) {
      console.log("SERVER CLIENT ID: ", message.clientId);
      queryClient.setQueryData<ChatSocketMessage[]>(
        ["messages", variables.conversationId],
        (old = []) => {
          console.log(old);
          return old.map((item) => {
            console.log(item.clientId, message.clientId);
            return item.clientId === message.clientId ? message : item
          })
        }
      )
    },

    onSettled(_data, _error, _variables, context) {
      if (context?.optimisticImageUrl) {
        URL.revokeObjectURL(context.optimisticImageUrl);
      }

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
