"use client";

import { useQuery } from "@tanstack/react-query";
import type { ChatSocketMessage } from "@chat/shared-types"

import { api } from "@/lib/api";

export function useMessages(conversationId?: string) {
  return useQuery<ChatSocketMessage[]>({
    queryKey: [
      "messages",
      conversationId,
    ],

    enabled: !!conversationId,

    queryFn: async() => {
      console.log("FETCHING", conversationId);

    const result = await api<ChatSocketMessage[]>(`api/messages?conversationId=${conversationId}`)

    console.log("FETCH FINISHED", result.length)

    return result;
    }
  });
}
