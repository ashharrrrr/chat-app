export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    username: string;
    image?: string;
  }[];
  isGroup: boolean;
}

export interface Message {
  _id: string;
  content: string;
  senderId: {
    _id: string;
    username: string;
    image ?: string;
  }
}
