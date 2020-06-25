import * as mongoose from "mongoose";

export enum ALERT_TYPES {
  PRICE = "PRICE",
  MEMPOOL = "MEMPOOL",
}

interface Alert extends mongoose.Document {
  currency?: string;
  alertUp?: any;
  from?: number;
  to: number;
  chatId: number;
  enabled?: boolean;
  type: ALERT_TYPES;
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
    type: {
      type: String,
      enum: [ALERT_TYPES.PRICE, ALERT_TYPES.MEMPOOL],
      default: ALERT_TYPES.PRICE,
      index: true,
    },
  },
  { timestamps: true },
);

const Alert = mongoose.model<Alert>("Alert", AlertSchema);

export default Alert;
