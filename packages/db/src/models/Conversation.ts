import mongoose, { Schema, Types, type Model } from "mongoose";


export interface IParticipant {
  user: Types.ObjectId;

  role: "member" | "admin";

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

const ParticipantSchema = new Schema<IParticipant>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["member", "admin"],
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  }
}, { _id: false });

const ConversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [ParticipantSchema],
      required: true,
    },

    isGroup: {
      type: Boolean,
      default: false,
    },

    title: String,

    image: {
      type: String,
    },

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
