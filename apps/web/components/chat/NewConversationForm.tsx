"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  createConversationSchema,
  type createConversationInput,
} from "@chat/shared-types";

import { useCreateConversation } from "@/hooks/useCreateConversation";

export default function NewConversationForm() {
  const createConversationMutation = useCreateConversation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createConversationInput>({
    resolver: zodResolver(createConversationSchema),
  });

  useEffect(() => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  }, [errors]);

  async function onSubmit(data: createConversationInput) {
    createConversationMutation.mutate(data.username, {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border-b p-4">
      <div className="flex gap-2">
        <input
          {...register("username")}
          placeholder="Start chat by username..."
          className="flex-1 rounded-lg border px-3 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={createConversationMutation.isPending}
          className="rounded-lg border px-3 py-2 font-medium"
        >
          {createConversationMutation.isPending ? "Creating..." : "New Chat"}
        </button>
      </div>
    </form>
  );
}
