import { getPrice } from "./blockchainApi";
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";

export default async function watcher(bot: Telegraf<TelegrafContext>) {
  getPrice("USD");
  getPrice("USDT");
  getPrice("IRT");
  setTimeout(async function () {
    await watcher(bot);
  }, 3600 * 1000);
}
