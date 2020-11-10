import User from "../models/user";
import { TelegrafContext } from "telegraf/typings/context";
import { logger } from "../utils/logger";

// Get or create User
export async function incrementUserUsage(ctx: TelegrafContext) {
  try {
    const sender = ctx.from;
    let user = await User.findOne({ chatId: ctx.chat?.id });
    if (!user) {
      const userModel = new User({
        firstName: sender?.first_name,
        lastName: sender?.last_name,
        username: sender?.username,
        isBot: sender?.is_bot,
        chatId: ctx.chat?.id,
      });
      user = await new User(userModel).save();
    } else {
      await user.updateOne({ $inc: { usage: 1 } });
    }
    return user;
  } catch (error) {
    logger.info(error);
  }
}
