import * as mongoose from "mongoose";

interface Alert extends mongoose.Document {
  currency: string;
  alertUp: any;
  from: number;
  to: number;
  chatId: number;
  enabled: boolean;
}

const Schema = mongoose.Schema;

var AlertSchema = new Schema(
  {
    chatId: {
      type: Number,
      index: true,
    },
    from: {
      type: Number,
      required: "Enter from",
    },
    to: {
      type: Number,
      required: "Enter to",
    },
    currency: {
      type: String,
      default: "USD",
    },
    alertUp: {
      type: Boolean,
      default: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Alert = mongoose.model<Alert>("Alert", AlertSchema);

export default Alert;
