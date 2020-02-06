import Telegraf, { ContextMessageUpdate } from "telegraf";
import {
  getPrice,
  getNumOfUnconfirmed,
  getPriceChange,
} from "../service/blockchainApi";
import { COMMANDS } from "../utils/consts";
import { str, KEYS } from "../locals";

export default async function registerStats(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.STATS, printStatsCommand);
}

async function printStatsCommand(ctx: ContextMessageUpdate) {
  const price = Number((await getPrice("USD")).toFixed(0)).toLocaleString();
  const priceIRT = Number((await getPrice("IRT")).toFixed(0)).toLocaleString();
  let numOfUnconfirmed = 0;
  try {
    numOfUnconfirmed = await getNumOfUnconfirmed();
  } catch (error) {
    console.log(error);
  }

  const change = Number((await getPriceChange()).toFixed(2));

  return ctx.replyWithHTML(
    str(ctx, KEYS.STATS_COMMAND, [price, priceIRT, change, numOfUnconfirmed]),
  );
}
