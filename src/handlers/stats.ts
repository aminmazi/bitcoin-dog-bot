import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getPrice, getNumOfUnconfirmed } from "../utils/blockchainApi";
import { COMMANDS } from "../utils/consts";

export default async function registerPrice(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.STATS, printStatsCommand);
}

async function printStatsCommand(ctx: ContextMessageUpdate) {
  const price = Number((await getPrice()).toFixed(0)).toLocaleString();

  const numOfUnconfirmed = await getNumOfUnconfirmed();

  return ctx.replyWithHTML(`<b>💰 Price: $${price}</b>

<b>⏳ Num Of Unconfirmed TXs: ${numOfUnconfirmed.toLocaleString()}</b>`);
}
