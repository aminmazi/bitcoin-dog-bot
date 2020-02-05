import Telegraf, { ContextMessageUpdate } from "telegraf";
import { COMMANDS } from "../utils/consts";
import { getPrice, getPriceForCurrency } from "../service/blockchainApi";
import Alert from "../models/alert";

export default async function registerAlerts(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.PRICE_ALERT, printAlertUpCommand);
}

async function printAlertUpCommand(ctx: ContextMessageUpdate) {
  const priceInUsd = Number((await getPrice("USD")).toFixed(0));
  const priceInIRT = Number((await getPrice("IRT")).toFixed(0));
  const params = ctx.message?.text?.split(" ");
  //check for incorrect usage
  if (!params || params?.length < 3) {
    return ctx.replyWithHTML(`<b>Usage template: /alert [value] [currency], for example:</b>

<b>/alert ${priceInUsd + 50} USD</b>

<b>/alert ${priceInIRT + 1000000} IRT</b>

<b>Enter a price above/below the current bitcoin price and you'll receive an alert the first time bitcoin cross this number!</b>`);
  }
  const to = Number(params[1]);
  const currency = params[2].toUpperCase();
  const alertUp = await getAlertTypeForCurrency(currency, to);
  await Alert.create({
    chatId: ctx.from?.id,
    currency,
    from: currency === "USD" ? priceInUsd : priceInIRT,
    to,
    alertUp,
  });
  return ctx.replyWithHTML(
    `<b>Alarm has been set. You'll be notified the first time price goes ${
      alertUp ? "up" : "down"
    } to ${to.toLocaleString()} ${currency} .</b>`,
  );
}

async function getAlertTypeForCurrency(
  currency: string,
  toPrice: Number,
): Promise<Boolean> {
  return toPrice > (await getPriceForCurrency(currency));
}
