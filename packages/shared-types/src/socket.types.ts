
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

export interface ClientToServerEvents {
  "conversation:join": (payload: {
    conversationId: string;
  }) => void;
  "message:send": (payload: MessagePayload) => void;
}

export interface ServerToClientEvents {
  "message:new": (payload: MessagePayload) =>  void;
}

export interface SocketData {
  user: SocketUser;
}

