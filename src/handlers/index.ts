import registerMenu from "./menu";
import registerStats from "./stats";
import registerAlerts from "./alerts";
import registerTa from "./technical-analysis";
import registerAdmin from "./admin";
import registerLang from "./lang";
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";

export async function registerHandlers(
  bot: Telegraf<TelegrafContext>,
): Promise<Telegraf<TelegrafContext>> {
  //start command handler
  await registerMenu(bot);
  // price command
  await registerStats(bot);
  // alert command
  await registerAlerts(bot);

  await registerTa(bot);

  await registerAdmin(bot);
  
  await registerLang(bot);

  return bot;
}
