import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getRSI, getSuggestionString } from "../service/taService";
const Extra = require('telegraf/extra');
import { str, KEYS } from "../locals";

export default async function registerTa(bot: Telegraf<ContextMessageUpdate>) {
  const regex = new RegExp(/ta_\w+/g);
  bot.command('/ta', (ctx: ContextMessageUpdate) => taCommandFunction(ctx, '1h'));
  bot.action(regex, (ctx: ContextMessageUpdate) => {
    const interval = (ctx.match?.input?.includes("_")) ? ctx.match?.input?.split("_")[1] : '1h';
    taCommandFunction(ctx, interval)
  });
}

async function taCommandFunction(ctx: ContextMessageUpdate, interval: string) {
  const rsiResult = await getRSI(interval);
  return ctx.reply(
    str(ctx, KEYS.RSI_MESSAGE, [rsiResult.rsi?.toFixed(0), getSuggestionString(ctx,
      rsiResult.suggestion,
    )]),
    Extra.HTML().markup((m: any) =>
      m.inlineKeyboard([
        [m.callbackButton('1️⃣1 min', 'ta_1m'),
        m.callbackButton('3️⃣3 min', 'ta_3m'),
        m.callbackButton('5️⃣5 min', 'ta_5m'),],
        [m.callbackButton('🕒15 min', 'ta_15m'),
        m.callbackButton('🕧30 min', 'ta_30m'),
        m.callbackButton('🕐1 hour', 'ta_1h'),],
        [m.callbackButton('🕑2 hours', 'ta_2h'),
        m.callbackButton('🕓4 hours', 'ta_4h'),
        m.callbackButton('🕕6 hours', 'ta_6h'),],
        [m.callbackButton('🕗8 hours', 'ta_8h'),
        m.callbackButton('🌗12 hours', 'ta_12h'),
        m.callbackButton('🌞1 day', 'ta_1d'),],
        [m.callbackButton('🥉3 day', 'ta_3d'),
        m.callbackButton('📅1 week', 'ta_1w'),
        m.callbackButton('📆1 month', 'ta_1M'),]
      ])
    )
  );
}
