"use client";

import getOtherParticipant from "./helper/getOtherParticipant";
import NewConversationForm from "./NewConversationForm";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import type { Conversation } from "@chat/shared-types";

import { ImageIcon } from "lucide-react";
import { ConversationListSkeleton } from "./ChatSkeletons";

interface ConversationListProps {
  conversations: Conversation[];
  isPending: boolean;
  isError: boolean;
  currentUserId: string;
  selectedConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  isPending,
  isError,
  selectedConversationId,
  onSelect,
  currentUserId,
}: ConversationListProps) {
  if (isPending) {
    return (
      <aside className="w-80 border-r border-gray-700 bg-gray-800 p-4 text-white">
        <ConversationListSkeleton />
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
    <aside className="min-w-80 border-r border-gray-700 bg-gray-800 overflow-y-auto flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-lg font-semibold text-white">Conversations</h2>
      </div>

      <NewConversationForm />

      <div className="flex-1 overflow-y-auto">
        {conversations?.map((conversation) => {
          const otherParticipantFetch = getOtherParticipant(
            conversation,
            currentUserId,
          );

          const otherParticipant = otherParticipantFetch?.username ?? "Unknown";

          const lastMessage = conversation.lastMessage;
          const isMine =
            lastMessage && String(lastMessage.senderId._id) === currentUserId;

          const senderPrefix = isMine ? "You: " : "";

          const previewContent = lastMessage ? (
            lastMessage.image ? (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span className="truncate">
                  {lastMessage.content?.trim() || "Shared image"}
                </span>
              </span>
            ) : (
              <span className="truncate">{lastMessage.content?.trim()}</span>
            )
          ) : (
            <span className="italic text-gray-500">No messages yet</span>
          );

          return (
            <button
              key={conversation._id}
              onClick={() => onSelect(conversation._id)}
              className={`w-full border-b border-gray-700 p-4 text-left transition-colors hover:bg-gray-700/60 ${selectedConversationId === conversation._id ? "bg-gray-700/80" : "bg-transparent"}`}
            >
              <div className="flex items-start gap-3">
                <ProfileAvatar
                  name={otherParticipant}
                  image={otherParticipantFetch?.image}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{otherParticipant}</p>

                  <p className="mt-1 flex min-w-0 items-start text-sm leading-5 text-gray-400">
                    <span className="mr-1.5 text-gray-300">{senderPrefix}</span>
                    <span className="min-w-0 truncate">{previewContent}</span>
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
