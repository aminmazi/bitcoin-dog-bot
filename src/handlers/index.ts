import registerMenu from "./menu";
import registerPrice from "./stats";
import Telegraf, { ContextMessageUpdate } from "telegraf";

export async function registerHandlers(
  bot: Telegraf<ContextMessageUpdate>,
): Promise<Telegraf<ContextMessageUpdate>> {
  //start command handler
  await registerMenu(bot);
  // price command
  await registerPrice(bot);

  return bot;
}
