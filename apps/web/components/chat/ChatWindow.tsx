"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "@/hooks/useMessages";
import MessageComposer from "./MessageComposer";
import type { Conversation } from "@chat/shared-types";

import { EmptyState, MessageListSkeleton } from "./ChatSkeletons";
import {MessageImage} from "./MessageImage";

import ProfileAvatar from "@/components/profile/ProfileAvatar";
import getOtherParticipant from "./helper/getOtherParticipant";
import Link from "next/link";

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
  console.log({ isPending, isError, count: data?.length })

  useEffect(() => {
    console.log("DATA CHANGED", data?.length);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data])

  if (!conversation) {
    return (
      <main className="flex flex-1 items-center justify-center bg-gray-900">
        <EmptyState
          title="Select a conversation"
          description="Choose a chat on the left to start messaging."
        />
      </main>
    );
  }

  const otherUser = getOtherParticipant(conversation, currentUserId)

  return (
    <main className="w-4xl flex flex-1 flex-col bg-gray-900">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Link href={`/u/${otherUser.username}`}
            className="flex
    items-center
    gap-3
    rounded-lg
    p-2
    transition-colors
    hover:bg-muted"
          >
            <ProfileAvatar name={otherUser.username} image={otherUser.image} size="sm" />
            <div>
              <p className="font-semibold">{otherUser.username}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-3">

        {isError ? (
          <EmptyState
            title="Couldn't load messages"
            description="Something went wrong while loading this conversation."
          />
        ) : isPending ? (
          <MessageListSkeleton />
        ) : data?.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Be the first to say hello."
          />
        ) : (
          data.map((message) => {
            const isMine =
              String(message.senderId._id) === currentUserId ||
              String(message.senderId._id) === "optimistic";
            return (
              <div
                key={message.clientId ?? message._id}
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
                    {message.image && (
                      <a
                        href={message.image}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-2 w-full block overflow-hidden rounded-xl"
                      >
                        <MessageImage src={message.image} alt="Shared Attachment" />
                      </a>
                    )}

                    {message.content && (
                      <p className="whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                  </div>
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer conversationId={conversation._id} />
    </main >
  );
}
