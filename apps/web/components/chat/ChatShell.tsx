"use client";


import { useState, useEffect } from "react";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

import { useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "@/providers/SocketProvider";
import { useConversations } from "@/hooks/useConversations";
import { MessagePayload, ChatSocketMessage } from "@chat/shared-types";

interface ChatShellProps {
  currentUserId: string;
}

export default function ChatShell({ currentUserId }: ChatShellProps) {

  const { data: conversations = [], isPending, isError } = useConversations();


  const [conversationId, setConversationId] = useState<string | null>(null);

  const activeConversationId = conversationId ?? conversations[0]?._id ?? null;

  const selectedConversation = conversations.find(
    (conversation) => conversation._id === conversationId
  )

  const socket = useChatSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", {
      conversationId,
    });
  }, [socket, conversationId])

  useEffect(() => {
    if (!socket) return;

    const handleMessageNew = ({
      conversationId: newConversationId,
      message,
    }: MessagePayload) => {

      console.log("SOCKET IMAGE", message.image);
      queryClient.setQueryData<ChatSocketMessage[] | undefined>(
        ["messages", newConversationId],
        (old) => {
          if (!old) {
            return old;
          }

          if (old.some((m) => m._id === message._id)) {
            return old;
          }

          return [...old, message]
        }
      ) 

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    socket.on("message:new", handleMessageNew);

    return () => {
      socket.off("message:new", handleMessageNew);
    }
  }, [socket, queryClient])

  return (
    <div className="mx-auto mt-3 flex h-[calc(100vh-6rem)] w-7xl bg-gray-900">
      <ConversationList
        conversations={conversations}
        isPending={isPending}
        isError={isError}
        currentUserId={currentUserId}
        selectedConversationId={activeConversationId}
        onSelect={setConversationId}
      />

      <ChatWindow conversation={selectedConversation} currentUserId={currentUserId} />
    </div>
  );
}
