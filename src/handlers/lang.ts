import Telegraf, { ContextMessageUpdate } from "telegraf";
import { COMMANDS } from "../utils/consts";
import User from "../models/user";
import { str, KEYS } from "../locals";

export default async function registerLang(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command(COMMANDS.LANG, printLangCommand);
}

async function printLangCommand(ctx: ContextMessageUpdate) {
  const lang = ctx.user.language === "fa" ? "en" : "fa";
  await User.updateOne({ chatId: ctx.user.chatId }, { language: lang });
  ctx.user.language = lang;
  return ctx.replyWithHTML(str(ctx, KEYS.LANG_CHANGED));
}
