import Telegraf, { ContextMessageUpdate } from "telegraf";
import { COMMANDS } from "../utils/consts";
import env from "../utils/env";
import User from "../models/user";
import Alert from "../models/alert";

export default async function registerAdmin(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.ADMIN, printAdminCommand);
}

async function printAdminCommand(ctx: ContextMessageUpdate) {
  if (ctx.chat && env.ADMINS.includes(ctx.chat?.id.toString())) {
    const userCount = await User.countDocuments({});
    const activeAlerts = await Alert.countDocuments({ enabled: true });
    return ctx.replyWithHTML(`<b>Users: ${userCount}</b>
<b>Alerts: ${activeAlerts}</b>`);
  }
}
