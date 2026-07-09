
export interface SocketUser {
  id: string;
  username: string;
}

export interface ChatSocketSender {
  _id: string;
  username: string;
  image?: string | null;
}

export interface ChatSocketMessage {
  _id: string;
  clientId: string;
  conversationId: string;
  content: string;
  image?: string;
  senderId: ChatSocketSender;
  createdAt: string;
  updatedAt: string;
  optimistic?: boolean;
}

export interface MessagePayload {
  conversationId: string;
  message: ChatSocketMessage;
}

export interface GroupEventPayload {
  conversationId: string;
}

export interface ClientToServerEvents {
  "conversation:join": (payload: {
    conversationId: string;
  }) => void;
  "message:send": (payload: MessagePayload) => void;
}

export interface ServerToClientEvents {
  "message:new": (payload: MessagePayload) => void;

  "group:updated": (payload: GroupEventPayload) => void;
  "group:memberAdded": (payload: GroupEventPayload) => void;
  "group:memberRemoved": (payload: GroupEventPayload) => void;
  "group:left": (payload: GroupEventPayload) => void;
}

export interface SocketData {
  user: SocketUser;
}

