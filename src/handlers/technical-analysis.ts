import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getRSI, getSuggestionString } from "../service/taService";

const taCommands = [
  "/ta",
  "/ta_1m",
  "/ta_3m",
  "/ta_5m",
  "/ta_15m",
  "/ta_30m",
  "/ta_1h",
  "/ta_2h",
  "/ta_4h",
  "/ta_6h",
  "/ta_8h",
  "/ta_12h",
  "/ta_1d",
  "/ta_3d",
  "/ta_1w",
  "/ta_1M",
];

export default async function registerTa(bot: Telegraf<ContextMessageUpdate>) {
  bot.command(taCommands, taCommandFunction);
}

async function taCommandFunction(ctx: ContextMessageUpdate) {
  if (ctx.message?.text?.includes("_")) {
    const interval = ctx.message?.text?.split("_")[1];
    const rsiResult = await getRSI(interval);
    return ctx.replyWithHTML(
      `<b>RSI: ${rsiResult.rsi?.toFixed(0)} , ${getSuggestionString(
        rsiResult.suggestion,
      )}</b>`,
    );
  } else {
    return ctx.replyWithHTML(`<b>🕯Please select one of the time frames below for technical analysis:</b>

<b>1️⃣ 1 minute: ${taCommands[1]}</b>

<b>3️⃣ 3 minutes: ${taCommands[2]}</b>

<b>5️⃣ 5 minutes: ${taCommands[3]}</b>

<b>🕒 15 minutes: ${taCommands[4]}</b>

<b>🕧 30 minutes: ${taCommands[5]}</b>

<b>🕐 1 hour: ${taCommands[6]}</b>

<b>🕑 2 hours: ${taCommands[7]}</b>

<b>🕓 4 hours: ${taCommands[8]}</b>

<b>🕕 6 hours: ${taCommands[9]}</b>

<b>🕗 8 hours: ${taCommands[10]}</b>

<b>🌗 12 hours: ${taCommands[11]}</b>
 
<b>🌞 1 day: ${taCommands[12]}</b>

<b>🥉 3 days: ${taCommands[13]}</b>

<b>📆 1 week: ${taCommands[14]}</b>

<b>🗓 1 month: ${taCommands[15]}</b>`);
  }
}
