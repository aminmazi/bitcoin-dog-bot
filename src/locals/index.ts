import { ContextMessageUpdate } from "telegraf/typings";
import { strEn } from "./en";
import { strFa } from "./fa";

export enum KEYS {
  MENU,
  ALERTS,
  STATS,
  ALERT_MENU,
  STATS_MENU,
  LANG_CHANGED,
  STATS_COMMAND,
  ALERT_HELP,
  ALERT_SET
}
export function str(ctx: ContextMessageUpdate, name: KEYS, params: any[] = []) {
  switch (ctx.user.language) {
    case "en":
      return strEn(name, params);
    case "fa":
      return strFa(name, params);
    default:
      return "";
  }
}
