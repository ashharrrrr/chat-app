import mongoose, { Schema, Types, Document } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[]
  isGroup: boolean;
  name?: string;
  lastMessage?: Types.ObjectId;
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
    
    name: String,

  lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);
