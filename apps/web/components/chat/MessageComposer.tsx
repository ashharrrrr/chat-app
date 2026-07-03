"use client";

import { useEffect, useRef, useState } from "react";
import { Image, X } from "lucide-react";

import { toast } from "sonner";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  messageContentSchema,
  type MessageContentInput,
} from "@chat/shared-types";

import { useChatSocket } from "@/providers/SocketProvider";
import { useSendMessage } from "@/hooks/useSendMessage";

interface MessageComposerProps {
  conversationId: string;
}

export default function MessageComposer({
  conversationId,
}: MessageComposerProps) {
  const socket = useChatSocket();
  const sendMessageMutation = useSendMessage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImage]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
  }

  function clearImage() {

    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

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
    console.log(selectedImage);
    const message = await sendMessageMutation.mutateAsync(
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

    socket?.emit("message:send", {
      conversationId,
      message,
    });

    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t border-gray-700 bg-gray-800 p-4">
      {previewUrl && (
        <div
          className="
      relative
      mb-3
      w-fit
    "
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="
        h-28
        w-28
        rounded-xl
        border
        object-cover
      "
          />

          <button
            type="button"
            onClick={clearImage}
            className="
        absolute
        right-2
        top-2
        rounded-full
        bg-black/70
        p-1
        text-white
        transition
        hover:bg-black
      "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          {...register("content")}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-gray-700 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-md p-2 hover:bg-muted transition-colors">
          <Image className="h-5 w-5" />
        </button>

        <button
          type="submit"
          disabled={sendMessageMutation.isPending}
          className="rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50">
          {sendMessageMutation.isPending ? "Sending..." : "Send"}
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
    </form>
  );
}

