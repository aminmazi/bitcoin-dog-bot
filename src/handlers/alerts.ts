import Telegraf, { ContextMessageUpdate } from "telegraf";
import { COMMANDS } from "../utils/consts";
import { getPrice, getPriceForCurrency } from "../service/blockchainApi";
import Alert from "../models/alert";
import { str, KEYS } from "../locals";

export default async function registerAlerts(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.PRICE_ALERT, printAlertUpCommand);
}

async function printAlertUpCommand(ctx: ContextMessageUpdate) {
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
  await Alert.create({
    chatId: ctx.chat?.id,
    currency,
    from: currency === "USD" ? priceInUsd : priceInIRT,
    to,
    alertUp,
  });
  return ctx.replyWithHTML(str(ctx, KEYS.ALERT_SET, [alertUp, to, currency]));
}

async function getAlertTypeForCurrency(
  currency: string,
  toPrice: Number,
): Promise<Boolean> {
  return toPrice > (await getPriceForCurrency(currency));
}
