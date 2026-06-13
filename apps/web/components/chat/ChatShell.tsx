"use client";

import { useState } from "react";

import ConversationList from "./ConversationList";

import ChatWindow from "./ChatWindow";

interface ChatShellProps {
  currentUserId: string;
}

export default function ChatShell({ currentUserId }: ChatShellProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);

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
