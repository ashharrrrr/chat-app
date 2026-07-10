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

export const createGroupSchema = z.object({
  title: z.string().trim().min(3, "Group title mustt be at least 3 characters.").max(50, "Group title must be at most 50 characters"),
  usernames: z.array(z.string()).min(1, "Select at least one member.").refine(
    (usernames) => new Set(usernames).size === usernames.length,
    {
      message: "Duplicate usernames are not allowed.",
    }
  ),
})

export const renameGroupSchema = z.object({
  conversationId: z.string(),
  title: z.string().trim().min(3, "Group title mustt be at least 3 characters.").max(50, "Group title must be at most 50 characters"),
})

export const addMembersSchema = z.object({
  conversationId: z.string(),
  usernames: z.array(z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters"))
})

export const removeMemberSchema = z.object({
  conversationId: z.string(),
  memberId: z.string(),
})

export const updateMemberRoleSchema = z.object({
  conversationId: z.string(),
  memberId: z.string(),
  role: z.enum(["member", "admin"]),
})

export const leaveGroupSchema = z.object({
  conversationId: z.string(),
})

export type createConversationInput = z.infer<typeof createConversationSchema>;
export type sendMessageInput = z.infer<typeof sendMessageSchema>;
export type MessageContentInput = z.infer<typeof messageContentSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type RenameGroupInput = z.infer<typeof renameGroupSchema>;
export type AddMembersInput = z.infer<typeof addMembersSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type LeaveGroupInput = z.infer<typeof leaveGroupSchema>;

