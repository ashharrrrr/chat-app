"use client";

import { useConversations } from "@/hooks/useConversations";
import  getOtherParticipant  from "./helper/getOtherParticipant"
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
      <aside className="w-80 border-r p-4">
        Loading conversations...
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="w-80 border-r p-4">
        Failed to load conversations
      </aside>
    );
  }


  return (
    <aside className="w-80 border-r overflow-y-auto">
      <div className="border-b p-4">
        <h2 className="font-semibold">
          Conversations
        </h2>
      </div>

      <NewConversationForm />

      {data?.map((conversation: any) => {
        {console.log("conversation", conversation)}
        const otherParticipant = getOtherParticipant(conversation, currentUserId).username

        return (
          <button
            key={conversation._id}
            onClick={() =>
              onSelect(conversation._id)
            }
            className={`
              hover:cursor-pointer
              w-full
              border-b
              p-4
              text-left
              hover:bg-muted/50
              ${selectedConversationId ===
                conversation._id
                ? "bg-muted"
                : ""
              }
            `}
          >
            <p className="font-medium">
              {otherParticipant}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
