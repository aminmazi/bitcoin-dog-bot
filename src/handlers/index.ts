import registerMenu from "./menu";
import registerStats from "./stats";
import registerAlerts from "./alerts";
import Telegraf, { ContextMessageUpdate } from "telegraf";

export async function registerHandlers(
  bot: Telegraf<ContextMessageUpdate>,
): Promise<Telegraf<ContextMessageUpdate>> {
  //start command handler
  await registerMenu(bot);
  // price command
  await registerStats(bot);
  // alert command
  await registerAlerts(bot);

  return bot;
}
