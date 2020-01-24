import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    telegramId: {
      type: Number,
      required: "Enter a telegramId",
      unique: true,
      index: true,
    },
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

const User = mongoose.model("User", UserSchema);

export default User;
