import Telegraf, { ContextMessageUpdate, Extra, Markup } from "telegraf";
import { COMMANDS } from "../utils/commands";
export default async function registerMenu(
  bot: Telegraf<ContextMessageUpdate>,
) {
  //start commands prints the menu
  bot.start(printStatsMenu);
  bot.help(printStatsMenu);

  //register Alert Menu action
  bot.action("Alerts", switchToAlertMenu);
  //register Stats Menu action
  bot.action("Stats", switchToStatsMenu);
}
async function printStatsMenu(ctx: ContextMessageUpdate) {
  return ctx.reply(
    `<b>Choose one of the commands on the menu or switch to another category using the buttons below the menu.</b>

<i>${COMMANDS.PRICE} → get current bitcoin price ＄</i>

<i>${COMMANDS.UNCONFIRMED} → Unconfirmed Txs ⏳</i>`,
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton("* Stats *", "Stats"),
        m.callbackButton("Alerts", "Alerts"),
      ]),
    ),
  );
}

async function switchToAlertMenu(ctx: ContextMessageUpdate) {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `<strong>Alerts 🔔</strong>
<b>You can set an alert and we will send you a message when an alert is triggered</b>

<i>${COMMANDS.PRICE_ALERT_UP} 📈 → Notify me when price is more than x</i>`,
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton("Stats", "Stats"),
        m.callbackButton("* Alerts *", "Alerts"),
      ]),
    ),
  );
}

async function switchToStatsMenu(ctx: ContextMessageUpdate) {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `<strong>Stats ℹ️</strong>

<i>${COMMANDS.PRICE} → get current bitcoin price ＄</i>

<i>${COMMANDS.UNCONFIRMED} → Unconfirmed Txs ⏳</i>`,
    Extra.HTML().markup((m: any) =>
      Markup.inlineKeyboard([
        m.callbackButton("* Stats *", "Stats"),
        m.callbackButton("Alerts", "Alerts"),
      ]),
    ),
  );
}
