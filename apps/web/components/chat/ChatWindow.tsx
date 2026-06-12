"use client";

import { useMessages } from "@/hooks/useMessages";

import MessageComposer from "./MessageComposer";

interface ChatWindowProps {
  conversationId: string | null;
}

export default function ChatWindow({
  conversationId,
}: ChatWindowProps) {
  const {
    data,
    isPending,
    isError,
  } = useMessages(
    conversationId ?? undefined
  );

  if (!conversationId) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">
          Select a conversation
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {isPending && (
          <p>Loading messages...</p>
        )}

        {isError && (
          <p>
            Failed to load messages
          </p>
        )}

        {data?.map((message) => (
          <div
            key={message._id}
            className="mb-3"
          >
            <p className="text-xs text-muted-foreground">
              {
                message.senderId
                  ?.username
              }
            </p>

            <div className="inline-block rounded-lg border px-3 py-2">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <MessageComposer
        conversationId={
          conversationId
        }
      />
    </main>
  );
}
