import mongoose, { Schema, Types, Document } from "mongoose";

export interface IMessage extends Document {
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

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
