"use client";

import { useQuery } from "@tanstack/react-query";
import type { Message } from "@chat/shared-types"

import { api } from "@/lib/api";

export function useMessages(conversationId?: string) {
  return useQuery<Message[]>({
    queryKey: [
      "messages",
      conversationId,
    ],

    enabled: !!conversationId,

    queryFn: () => api<Message[]>(`api/messages?conversationId=${conversationId}`),
  });
}
