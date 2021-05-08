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
import { logger } from "../utils/logger";

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
  const priceEthInIRT = Number((await getPrice("ETH-IRT")).toFixed(0)).toLocaleString();
  const priceEthInUSD = Number((await getPrice("ETH-USD")).toFixed(0)).toLocaleString();
  let numOfUnconfirmed = 0;
  try {
    numOfUnconfirmed = await getNumOfUnconfirmed();
  } catch (error) {
    logger.error(error);
  }

  const changeInUSD = Number((await getPriceChange("btc_TO_usd")).toFixed(2));
  const changeForIRT = Number((await getPriceChange("btc_TO_rls")).toFixed(2));
  const changeForUSDT = Number((await getPriceChange("usdt_TO_rls")).toFixed(2));
  const changeForETHinIRT = Number((await getPriceChange("eth_TO_rls")).toFixed(2));
  const changeForETHInUSD = Number((await getPriceChange("eth_TO_usdt")).toFixed(2));

  logger.info("running stat command", {
    data: {
      priceInUSD,
      priceIRT,
      changeInUSD,
      numOfUnconfirmed,
      priceOfUSDT,
      changeForIRT,
      changeForUSDT,
      cache: cache?.data,
      priceEthInIRT,
      priceEthInUSD
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
      priceEthInIRT,
      priceEthInUSD,
      changeForETHinIRT,
      changeForETHInUSD
    ]),
  );
}
