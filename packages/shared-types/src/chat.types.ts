export interface Message {
  _id: string;
  clientId?: string;
  content: string;
  image?: string | null;
  createdAt: string;
  senderId: {
    _id: string;
    username: string;
    image ?: string;
  }
  optimistic?: boolean,
}

export interface ConversationParticipant {
  _id: string;
  username: string;
  about: string;
  image?: string;
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

  createdAt: string;

  updatedAt: string;

  lastMessage?: LastMessage;
}
