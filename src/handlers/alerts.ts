import Telegraf from "telegraf";
import { COMMANDS } from "../utils/consts";
import { getPrice, getPriceForCurrency } from "../service/blockchainApi";
import Alert, { ALERT_TYPES } from "../models/alert";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";

export default async function registerAlerts(bot: Telegraf<TelegrafContext>) {
  bot.command(COMMANDS.PRICE_ALERT, printAlertUpCommand);
  bot.command(COMMANDS.MEMPOOL_ALERT, printMempoolAlertCommand);
}

async function printAlertUpCommand(ctx: TelegrafContext) {
  const priceInUsd = Number((await getPrice("USD")).toFixed(0));
  const priceInIRT = Number((await getPrice("IRT")).toFixed(0));
  let params = ctx.message?.text?.split(" ");
  //check for incorrect usage
  if (!params || params?.length < 2) {
    return ctx.replyWithHTML(
      str(ctx, KEYS.ALERT_HELP, [priceInUsd, priceInIRT]),
    );
  }
  if (params.length == 2) params[2] = "USD";
  const to = Number(params[1]);
  const currency = params[2].toUpperCase();
  const alertUp = await getAlertTypeForCurrency(currency, to);
  const chatId = ctx.chat?.id || 0;
  await Alert.create({
    chatId,
    currency,
    from: currency === "USD" ? priceInUsd : priceInIRT,
    to,
    alertUp,
    type: ALERT_TYPES.PRICE,
  });
  return ctx.replyWithHTML(str(ctx, KEYS.ALERT_SET, [alertUp, to, currency]));
}

async function getAlertTypeForCurrency(
  currency: string,
  toPrice: Number,
): Promise<Boolean> {
  return toPrice > (await getPriceForCurrency(currency));
}

async function printMempoolAlertCommand(ctx: TelegrafContext) {
  let params = ctx.message?.text?.split(" ");
  //check for incorrect usage
  if (!params || params?.length !== 2) {
    return ctx.replyWithHTML(str(ctx, KEYS.MEMPOOL_ALERT_HELP));
  }
  const to = Number(params[1]);
  const chatId = ctx.chat?.id || 0;
  await Alert.create({
    chatId,
    to,
    type: ALERT_TYPES.MEMPOOL,
  });
  return ctx.replyWithHTML(str(ctx, KEYS.MEMPOOL_ALERT_SET, [to]));
}
