import Telegraf, { ContextMessageUpdate } from "telegraf";

export default async function registerPrice(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command("price", printPriceCommand);
}

async function printPriceCommand(ctx: ContextMessageUpdate) {
  return ctx.reply("fake price for now");
}
