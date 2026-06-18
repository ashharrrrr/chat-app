import mongoose, { Schema, Types, type Model } from "mongoose";

export interface IMessage {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = (mongoose.models.Message as Model<IMessage>) ?? mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
