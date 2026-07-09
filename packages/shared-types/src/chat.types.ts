
export const ConversationRole = {
  MEMBER: "member",
  ADMIN: "admin"
}

export type ConversationRole = (typeof ConversationRole)[keyof typeof ConversationRole]

export interface Message {
  _id: string;
  clientId?: string;
  content: string;
  image?: string | null;
  createdAt: string;
  senderId: {
    _id: string;
    username: string;
    image?: string;
  }
  optimistic?: boolean,
}

export interface ConversationParticipant {
  user: {
    _id: string;
    username: string;
    about: string;
    image?: string;
  };

  role: ConversationRole;

  joinedAt: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  image?: string | null;

  createdAt: string;
  senderId: {
    _id: string;
    username: string;
    image?: string | null;
  };
}

export interface Conversation {
  _id: string;

  participants: ConversationParticipant[];
  isGroup: boolean;
  title?: string;
  image?: string;

  createdAt: string;
  updatedAt: string;

  lastMessage?: LastMessage;
}
