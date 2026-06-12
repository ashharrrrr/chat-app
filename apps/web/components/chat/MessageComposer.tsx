"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  messageContentSchema,
  type MessageContentInput,
} from "@chat/shared-types";

import { useSendMessage }
  from "@/hooks/useSendMessage";

interface MessageComposerProps {
  conversationId: string;
}

export default function MessageComposer({
  conversationId,
}: MessageComposerProps) {
  const sendMessageMutation =
    useSendMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageContentInput>({
    resolver: zodResolver(
      messageContentSchema
    ),
  });

  useEffect(() => {
    const firstError =
      Object.values(errors)[0];

    if (
      firstError?.message
    ) {
      toast.error(
        firstError.message
      );
    }
  }, [errors]);

  async function onSubmit(
    data: MessageContentInput
  ) {
    sendMessageMutation.mutate(
      {
        conversationId,
        content: data.content,
      },
      {
        onSuccess() {
          reset();
        },
      }
    );
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="
        border-t
        p-4
      "
    >
      <div className="flex gap-2">
        <input
          {...register("content")}
          placeholder="Type a message..."
          className="
            flex-1
            rounded-lg
            border
            px-4
            py-2
            outline-none
          "
        />

        <button
          type="submit"
          disabled={
            sendMessageMutation.isPending
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            font-medium
          "
        >
          {sendMessageMutation.isPending
            ? "Sending..."
            : "Send"}
        </button>
      </div>
    </form>
  );
}
