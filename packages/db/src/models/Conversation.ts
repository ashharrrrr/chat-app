import mongoose, { Schema, Types, type Model } from "mongoose";

enum conversationRole {
  MEMBER = "member",
  ADMIN = "admin",
}

interface IParticipant {
  user: Types.ObjectId;

  role: conversationRole;

  joinedAt: Date;
}

export interface IConversation {
  participants: IParticipant[];
  isGroup: boolean;
  title?: string;
  image?: string;
  lastMessage?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],

    isGroup: {
      type: Boolean,
      default: false,
    },

    title: String,

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true
  }
);

const Conversation: Model<IConversation> = (mongoose.models.Conversation as Model<IConversation>) ?? mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
