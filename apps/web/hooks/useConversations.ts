"use client";

import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "@chat/shared-types";

import { api } from "@/lib/api";

export function useConversations(){
  return useQuery({
    queryKey: ["conversations"],

    queryFn: () => api<Conversation[]>("/api/conversations"),
  });
}
