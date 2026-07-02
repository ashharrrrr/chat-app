"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "@/hooks/useMessages";
import MessageComposer from "./MessageComposer";
import type { Conversation } from "@chat/shared-types";

import ProfileAvatar from "@/components/profile/ProfileAvatar";
import getOtherParticipant from "./helper/getOtherParticipant";

interface ChatWindowProps {
  conversation?: Conversation;
  currentUserId: string;
}

export default function ChatWindow({
  conversation,
  currentUserId,
}: ChatWindowProps) {

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isPending, isError } = useMessages(conversation?._id ?? undefined);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data])

  if (!conversation) {
    return (
      <main className="flex flex-1 items-center justify-center bg-gray-900">
        <p className="text-gray-400">Select a conversation to start chatting</p>
      </main>
    );
  }

  const otherUser = getOtherParticipant(conversation, currentUserId)

  return (
    <main className="w-4xl flex flex-1 flex-col bg-gray-900">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <ProfileAvatar name={otherUser.username} image={otherUser.image} size="sm" />
          <div>
            <p className="font-semibold">{otherUser.username}</p>
            <p className="text-sm text-muted-foreground">
              {otherUser.about || " "}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-3">
        {isPending && <p className="text-gray-400">Loading messages...</p>}

        {isError && <p className="text-gray-400">Failed to load messages</p>}
        {data?.map((message) => {
          const isMine = String(message.senderId._id) === currentUserId || String(message.senderId._id) === "optimistic";

          return (
            <div
              key={message._id}
              className={`mb-4 flex ${isMine ? "justify-end" : "justify-start"
                }`}>
              <div
                className="
          max-w-[70%]
          space-y-1
        ">
                <p
                  className={`
                    mt-1 truncate
            text-xs
            text-muted-foreground
            ${isMine ? "text-right pe-5" : ""}
          `}>
                  {message.senderId.username}
                </p>

                <div
                  className={`
            rounded-2xl
            px-4
            py-2
            wrap-break-word 
            ${isMine ? "bg-blue-600" : "bg-gray-300 text-black"}
            ${message.optimistic ? "opacity-60" : ""}
          `}>
                  {message.content}
                </div>
                {
                  message.optimistic && (
                    <p className="text-xs text-muted-foreground">
                      Sending...
                    </p>
                  )
                }
                <p
                  className={`
    text-[10px]
    text-muted-foreground
    ${isMine ? "text-right" : ""}
  `}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer conversationId={conversation._id} />
    </main>
  );
}
