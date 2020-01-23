import User from "../models/user";

// Get or create User
export async function incrementUserUsage(sender: any) {
  try {
    let user = await User.findOne({ telegramId: sender.id });
    if (!user) {
      const userModel = new User({
        telegramId: sender.id,
        firstName: sender.first_name,
        lastName: sender.last_name,
        username: sender.username,
        isBot: sender.is_bot,
      });
      await new User(userModel).save();
    } else {
      await user.updateOne({ $inc: { usage: 1 } });
    }
  } catch (error) {
    console.log(error);
  }
}
