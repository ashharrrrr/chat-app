"use client";

import { useState } from "react";

import ConversationList
  from "./ConversationList";

import ChatWindow
  from "./ChatWindow";

interface ChatShellProps {
  currentUserId: string;
}

export default function ChatShell({ currentUserId }: ChatShellProps) {
  const [
    conversationId,
    setConversationId,
  ] = useState<
    string | null
  >(null);

  return (
    <div
      className="
        mx-auto
        mt-4
        flex
        h-[calc(100vh-2rem)]
        max-w-7xl
        overflow-hidden
        rounded-2xl
        border
      "
    >
      <ConversationList
        currentUserId={currentUserId}
        selectedConversationId={
          conversationId
        }
        onSelect={
          setConversationId
        }
      />

      <ChatWindow
        conversationId={
          conversationId
        }
      />
    </div>
  );
}
