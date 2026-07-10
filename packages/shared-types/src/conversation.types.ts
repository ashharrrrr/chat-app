export const ConversationRoles = {
  MEMBER: "member",
  ADMIN: "admin",
} as const;

export type ConversationRole =
  (typeof ConversationRoles)[keyof typeof ConversationRoles];

export interface ConversationParticipantInput {
  user: string;
  role: ConversationRole;
  joinedAt: Date;
}
