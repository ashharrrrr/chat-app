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
          const otherParticipant = getOtherParticipant(
            conversation,
            currentUserId,
          ).username;

          return (
            <button
              key={conversation._id}
              onClick={() => onSelect(conversation._id)}
              className={`w-full border-b border-gray-700 p-4 text-left transition-colors ${
                selectedConversationId === conversation._id
                  ? "bg-gray-700"
                  : "hover:bg-gray-700/50"
              }`}>
              <p className="font-medium text-white">{otherParticipant}</p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
