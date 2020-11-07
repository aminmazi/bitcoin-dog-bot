import Telegraf from "telegraf";
import {
  getPrice,
  getNumOfUnconfirmed,
  getPriceChange,
} from "../service/blockchainApi";
import { COMMANDS } from "../utils/consts";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";

export default async function registerStats(bot: Telegraf<TelegrafContext>) {
  bot.command(COMMANDS.STATS, printStatsCommand);
}

async function printStatsCommand(ctx: TelegrafContext) {
  const priceInUSD = Number(
    (await getPrice("USD")).toFixed(0),
  ).toLocaleString();
  const priceIRT = Number((await getPrice("IRT")).toFixed(0)).toLocaleString();
  const priceOfUSDT = Number(
    (await getPrice("USDT")).toFixed(0),
  ).toLocaleString();
  let numOfUnconfirmed = 0;
  try {
    numOfUnconfirmed = await getNumOfUnconfirmed();
  } catch (error) {
    ctx.logger.error(error);
  }

  const changeInUSD = Number((await getPriceChange()).toFixed(2));

  return ctx.replyWithHTML(
    str(ctx, KEYS.STATS_COMMAND, [
      priceInUSD,
      priceIRT,
      changeInUSD,
      numOfUnconfirmed,
      priceOfUSDT,
    ]),
  );
}
