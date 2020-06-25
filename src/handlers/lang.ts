import Telegraf from "telegraf";
import { COMMANDS } from "../utils/consts";
import User from "../models/user";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";

export default async function registerLang(
  bot: Telegraf<TelegrafContext>,
) {
  bot.command(COMMANDS.LANG, printLangCommand);
}

async function printLangCommand(ctx: TelegrafContext) {
  const lang = ctx.user.language === "fa" ? "en" : "fa";
  await User.updateOne({ chatId: ctx.user.chatId }, { language: lang });
  ctx.user.language = lang;
  return ctx.replyWithHTML(str(ctx, KEYS.LANG_CHANGED));
}
