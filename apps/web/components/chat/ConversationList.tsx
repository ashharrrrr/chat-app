"use client";

import { useConversations } from "@/hooks/useConversations";
import getOtherParticipant from "./helper/getOtherParticipant";
import NewConversationForm from "./NewConversationForm";

interface ConversationListProps {
  currentUserId: string;
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  selectedConversationId,
  onSelect,
  currentUserId,
}: ConversationListProps) {
  const { data, isPending, isError } = useConversations();

  if (isPending) {
    return (
      <aside className="w-80 border-r border-gray-700 bg-gray-800 p-4 text-white">
        Loading conversations...
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="w-80 border-r border-gray-700 bg-gray-800 p-4 text-white">
        Failed to load conversations
      </aside>
    );
  }

  return (
    <aside className="w-80 border-r border-gray-700 bg-gray-800 overflow-y-auto flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
      </div>

      <NewConversationForm />

      <div className="flex-1 overflow-y-auto">
        {data?.map((conversation) => {
          {
            console.log("conversation", conversation);
          }
          const otherParticipantFetch = getOtherParticipant(
            conversation,
            currentUserId,
          );

          const otherParticipant  =  otherParticipantFetch?.username ??  "Unknown";

          return (
            <button
              key={conversation._id}
              onClick={() => onSelect(conversation._id)}
              className={`
    w-full
    border-b
    p-4
    text-left
    hover:bg-muted/50
    ${selectedConversationId === conversation._id ? "bg-muted" : ""}
  `}
            >
              <p className="font-bold">{otherParticipant}</p>

              <p
                className="
      mt-1
      truncate
      text-sm
      text-muted-foreground
      font-extralight
    "
              >
                {conversation.lastMessage
                  ? `${
                      String(conversation.lastMessage.senderId._id) ===
                      currentUserId
                        ? "You: "
                        : "" 
                    } ${conversation.lastMessage.content}`
                  : "No messages yet"}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
