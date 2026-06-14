"use client";

import { useState, useEffect } from "react";

import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

import { useQueryClient } from "@tanstack/react-query";
import { useChatSocket } from "@/providers/SocketProvider";

interface ChatShellProps {
  currentUserId: string;
}

export default function ChatShell({ currentUserId }: ChatShellProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);

  const socket = useChatSocket();
  const queryClient  = useQueryClient();

  useEffect(() =>  {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", {
      conversationId,
    });
  }, [socket, conversationId])

  useEffect(() => {
    if(!socket) return;

    const handleMessageNew = ({
      conversationId: newConversationId,
    }: { conversationId: string; })  => {
      queryClient.invalidateQueries({
        queryKey: [
          "messages", newConversationId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey:["conversations"],
      });
    };

    socket.on("message:new", handleMessageNew);

    return () => {
      socket.off("message:new", handleMessageNew);
    }
  }, [socket, queryClient])

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] w-7xl bg-gray-900">
      <ConversationList
        currentUserId={currentUserId}
        selectedConversationId={conversationId}
        onSelect={setConversationId}
      />

      <ChatWindow conversationId={conversationId} currentUserId={currentUserId}/>
    </div>
  );
}
