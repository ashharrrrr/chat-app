"use client";

import { useEffect } from "react";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  messageContentSchema,
  type MessageContentInput,
} from "@chat/shared-types";

import { useSendMessage } from "@/hooks/useSendMessage";

interface MessageComposerProps {
  conversationId: string;
}

export default function MessageComposer({
  conversationId,
}: MessageComposerProps) {
  const sendMessageMutation = useSendMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageContentInput>({
    resolver: zodResolver(messageContentSchema),
  });

  useEffect(() => {
    const firstError = Object.values(errors)[0];

    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }, [errors]);

  async function onSubmit(data: MessageContentInput) {
    sendMessageMutation.mutate(
      {
        conversationId,
        content: data.content,
      },
      {
        onSuccess() {
          reset();
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t border-gray-700 bg-gray-800 p-4">
      <div className="flex gap-2">
        <input
          {...register("content")}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={sendMessageMutation.isPending}
          className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50">
          {sendMessageMutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
