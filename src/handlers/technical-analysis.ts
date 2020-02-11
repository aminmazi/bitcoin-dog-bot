import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getRSI, getSuggestionString } from "../service/taService";
import Extra from "telegraf/extra";
import { str, KEYS } from "../locals";

interface TaResult {
  value: string;
  suggestion: string;
}

export default async function registerTa(bot: Telegraf<ContextMessageUpdate>) {
  const regex = new RegExp(/ta_\w+/g);
  bot.command("/ta", (ctx: ContextMessageUpdate) =>
    taCommandFunction(ctx, "1h"),
  );
  bot.action(regex, async (ctx: ContextMessageUpdate) => {
    const interval = ctx.match?.input?.includes("_")
      ? ctx.match?.input?.split("_")[1]
      : "1h";

    await ctx.editMessageText(
      str(ctx, KEYS.TA_MESSAGE, await getTas(ctx, interval)),
      Extra.HTML().markup((m: any) =>
        m.inlineKeyboard([
          [
            m.callbackButton("1m", "ta_1m"),
            m.callbackButton("3m", "ta_3m"),
            m.callbackButton("5m", "ta_5m"),
            m.callbackButton("15m", "ta_15m"),
            m.callbackButton("30m", "ta_30m"),
          ],
          [
            m.callbackButton("1h", "ta_1h"),
            m.callbackButton("2h", "ta_2h"),
            m.callbackButton("4h", "ta_4h"),
            m.callbackButton("6h", "ta_6h"),
            m.callbackButton("8h", "ta_8h"),
            m.callbackButton("12h", "ta_12h"),
          ],
          [
            m.callbackButton("1d", "ta_1d"),
            m.callbackButton("3d", "ta_3d"),
            m.callbackButton("1w", "ta_1w"),
            m.callbackButton("1M", "ta_1M"),
          ],
        ]),
      ),
    );
    await ctx.answerCbQuery();
  });
}

async function taCommandFunction(ctx: ContextMessageUpdate, interval: string) {
  return ctx.reply(
    str(ctx, KEYS.TA_MESSAGE, await getTas(ctx, interval)),
    Extra.HTML().markup((m: any) =>
      m.inlineKeyboard([
        [
          m.callbackButton("1m", "ta_1m"),
          m.callbackButton("3m", "ta_3m"),
          m.callbackButton("5m", "ta_5m"),
          m.callbackButton("15m", "ta_15m"),
          m.callbackButton("30m", "ta_30m"),
        ],
        [
          m.callbackButton("1h", "ta_1h"),
          m.callbackButton("2h", "ta_2h"),
          m.callbackButton("4h", "ta_4h"),
          m.callbackButton("6h", "ta_6h"),
          m.callbackButton("8h", "ta_8h"),
          m.callbackButton("12h", "ta_12h"),
        ],
        [
          m.callbackButton("1d", "ta_1d"),
          m.callbackButton("3d", "ta_3d"),
          m.callbackButton("1w", "ta_1w"),
          m.callbackButton("1M", "ta_1M"),
        ],
      ]),
    ),
  );
}

async function getTas(ctx: ContextMessageUpdate, interval: string) {
  let sum = 0;

  //get RSI
  const rsiResult = await getRSI(interval);
  sum += rsiResult.suggestion;

  const taResults: TaResult[] = [
    //convert RSI to human readable object
    {
      value: rsiResult.rsi.toFixed(0),
      suggestion: getSuggestionString(ctx, rsiResult.suggestion),
    },
  ];

  //compute average for overall suggestion
  const average = getSuggestionString(ctx, Math.round(sum / taResults.length));

  return [taResults, interval, average];
}
