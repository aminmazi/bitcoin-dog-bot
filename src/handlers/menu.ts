import Telegraf, { ContextMessageUpdate, Extra, Markup } from "telegraf";
import { COMMANDS } from "../utils/consts";
import { str, KEYS } from "../locals";

export default async function registerMenu(
  bot: Telegraf<ContextMessageUpdate>,
) {
  //start commands prints the menu
  bot.start(printStatsMenu);
  bot.command(COMMANDS.MENU, printStatsMenu);
  bot.help(printStatsMenu);

  //register Alert Menu action
  bot.action("Alerts", switchToAlertMenu);
  //register Stats Menu action
  bot.action("Stats", switchToStatsMenu);
}
async function printStatsMenu(ctx: ContextMessageUpdate) {
  return ctx.reply(
    str(ctx, KEYS.MENU, [COMMANDS.STATS, COMMANDS.TECHNICAL_ANALYSIS]),
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton(`* ${str(ctx, KEYS.STATS, [])} *`, "Stats"),
        m.callbackButton(`${str(ctx, KEYS.ALERTS, [])}`, "Alerts"),
      ]),
    ),
  );
}

async function switchToAlertMenu(ctx: ContextMessageUpdate) {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    str(ctx, KEYS.ALERT_MENU, [COMMANDS.PRICE_ALERT]),
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton(`${str(ctx, KEYS.STATS, [])}`, "Stats"),
        m.callbackButton(`* ${str(ctx, KEYS.ALERTS, [])} *`, "Alerts"),
      ]),
    ),
  );
}

async function switchToStatsMenu(ctx: ContextMessageUpdate) {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    str(ctx, KEYS.STATS_MENU, [COMMANDS.STATS, COMMANDS.TECHNICAL_ANALYSIS]),
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton(`* ${str(ctx, KEYS.STATS, [])} *`, "Stats"),
        m.callbackButton(`${str(ctx, KEYS.ALERTS, [])}`, "Alerts"),
      ]),
    ),
  );
}
