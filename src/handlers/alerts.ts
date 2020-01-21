import Telegraf, { ContextMessageUpdate } from "telegraf";
import { COMMANDS } from "../utils/consts";

export default async function registerAlerts(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.PRICE_ALERT_UP, printAlertUpCommand);
}

async function printAlertUpCommand(ctx: ContextMessageUpdate) {
  return ctx.replyWithHTML(`<b>Under Construction!</b>`);
}
