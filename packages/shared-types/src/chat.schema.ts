import { z } from "zod";

export const createConversationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  content: z.string().trim(),
  hasImage: z.boolean(),
}).refine(({ content, hasImage }) => content.length > 0 || hasImage, {
  message: "Message cannot be empty.",
  path: ["content"],
});

export const messageContentSchema = z.object({
  content: z.string().trim().max(200, "Message is too long"),
});

export type createConversationInput = z.infer<typeof createConversationSchema>;
export type sendMessageInput = z.infer<typeof sendMessageSchema>;
export type MessageContentInput = z.infer<typeof messageContentSchema>;
