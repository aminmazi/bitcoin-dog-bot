import Telegraf from "telegraf";
import { getRSI, getSuggestionString, getStoch } from "../service/taService";
import Extra from "telegraf/extra";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";

interface TaResult {
  value: string;
  suggestion: string;
}

export default async function registerTa(bot: Telegraf<TelegrafContext>) {
  const regex = new RegExp(/ta_\w+/g);
  bot.command("/ta", (ctx: TelegrafContext) => taCommandFunction(ctx, "1h"));
  bot.action(regex, async (ctx: TelegrafContext) => {
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

async function taCommandFunction(ctx: TelegrafContext, interval: string) {
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

async function getTas(ctx: TelegrafContext, interval: string) {
  let sum = 0;

  //get RSI
  const rsiResult = await getRSI(interval, ctx.logger);
  sum += rsiResult.suggestion;

  //get Stoch
  const stochResult = await getStoch(interval, ctx.logger);
  sum += stochResult.suggestion;

  const taResults: TaResult[] = [
    //convert RSI to human readable object
    {
      value: rsiResult.rsi.toFixed(0),
      suggestion: getSuggestionString(ctx, rsiResult.suggestion),
    },
    //convert stoch to human readable object
    {
      value: `${stochResult.result.valueSlowD.toFixed(
        2,
      )},${stochResult.result.valueSlowK.toFixed(2)}`,
      suggestion: getSuggestionString(ctx, stochResult.suggestion),
    },
  ];

  //compute average for overall suggestion
  const average = getSuggestionString(ctx, Math.round(sum / taResults.length));

  return [taResults, interval, average];
}
