import Telegraf from "telegraf";
import {
  getPrice,
  getNumOfUnconfirmed,
  getPriceChange,
} from "../service/blockchainApi";
import { COMMANDS } from "../utils/consts";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";
import { cache } from "../utils/cache";

export default async function registerStats(bot: Telegraf<TelegrafContext>) {
  bot.context.logger.debug("received stats command", {
    data: { chatId: bot.context.user.chatId, cache: cache?.data },
  });
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

  const changeInUSD = Number((await getPriceChange("USD")).toFixed(2));
  const changeForIRT = Number((await getPriceChange("IRT")).toFixed(2));
  const changeForUSDT = Number((await getPriceChange("USDT")).toFixed(2));

  ctx.logger.debug("running stat command", {
    data: {
      priceInUSD,
      priceIRT,
      changeInUSD,
      numOfUnconfirmed,
      priceOfUSDT,
      changeForIRT,
      changeForUSDT,
      cache: cache?.data,
    },
  });

  return ctx.replyWithHTML(
    str(ctx, KEYS.STATS_COMMAND, [
      priceInUSD,
      priceIRT,
      changeInUSD,
      numOfUnconfirmed,
      priceOfUSDT,
      changeForIRT,
      changeForUSDT,
    ]),
  );
}
