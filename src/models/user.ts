import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export interface UserModel extends mongoose.Document {
  chatId: number;
  language: string;
  firstName: string;
  lastName: string;
  isBot: boolean;
  username: string;
  usage: number;
}

var UserSchema = new Schema(
  {
    chatId: {
      type: Number,
      required: "Enter a chatId",
      unique: true,
      index: true,
    },
    language: {
      type: String,
      default: "fa",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isBot: {
      type: Boolean,
    },
    username: {
      type: String,
    },
    usage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<UserModel>("User", UserSchema);

export default User;
