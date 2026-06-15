import mongoose, { Schema, Types, type Model } from "mongoose";

export interface IConversation {
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

const Conversation: Model<IConversation> = (mongoose.models.Conversation as Model<IConversation>) ?? mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
