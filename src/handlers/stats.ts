import Telegraf, { ContextMessageUpdate } from "telegraf";
import {
  getPrice,
  getNumOfUnconfirmed,
  getPriceChange,
} from "../service/blockchainApi";
import { COMMANDS } from "../utils/consts";

export default async function registerStats(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.STATS, printStatsCommand);
}

async function printStatsCommand(ctx: ContextMessageUpdate) {
  const price = Number((await getPrice("USD")).toFixed(0)).toLocaleString();
  const priceIRT = Number((await getPrice("IRT")).toFixed(0)).toLocaleString();

  const numOfUnconfirmed = await getNumOfUnconfirmed();

  const change = Number((await getPriceChange()).toFixed(2));

  return ctx.replyWithHTML(`<b>💰 Price: $${price} ,
🇮🇷 ${priceIRT} IRT</b>

<b>📈 24 hours change: ${change >= 0 ? `✅ +${change}` : `🔻 ${change}`}% </b>

<b>⏳ Num Of Unconfirmed TXs: ${numOfUnconfirmed.toLocaleString()}</b>`);
}
