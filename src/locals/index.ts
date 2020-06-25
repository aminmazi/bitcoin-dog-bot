import { strEn } from "./en";
import { strFa } from "./fa";
import { TelegrafContext } from "telegraf/typings/context";

export enum KEYS {
  MENU,
  ALERTS,
  STATS,
  ALERT_MENU,
  STATS_MENU,
  LANG_CHANGED,
  STATS_COMMAND,
  ALERT_HELP,
  ALERT_SET,
  ALERT_FIRE,
  BUY,
  NEUTRAL,
  SELL,
  STRONG_BUY,
  STRONG_SELL,
  TA_MESSAGE,
  MEMPOOL_ALERT_HELP,
  MEMPOOL_ALERT_SET,
  MEMPOOL_ALERT_FIRE,
}
export function str(ctx: TelegrafContext, name: KEYS, params: any[] = []) {
  switch (ctx.user.language) {
    case "en":
      return strEn(name, params);
    case "fa":
      return strFa(name, params);
    default:
      return "";
  }
}
