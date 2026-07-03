import mongoose, { Schema, type Model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  image?: string;
  about?: string;
}

const UserSchema = new Schema<IUser>(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = (mongoose.models.User as Model<IUser>) ?? mongoose.model<IUser>("User", UserSchema);

export default User;
