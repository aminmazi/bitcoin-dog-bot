import Telegraf, { Context } from "telegraf";
import env from "./utils/env";
import { registerHandlers } from "./handlers";
//@ts-ignore
import rateLimit from "telegraf-ratelimit";
import { createInstance as initCacheInstance } from "./utils/cache";

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 60000,
  limit: 40,
  onLimitExceeded: (ctx: any) => ctx.reply("Rate limit exceeded"),
};

async function main() {
  let bot = new Telegraf(env.BOT_TOKEN);
  //init cache
  initCacheInstance();
  //rate limit
  bot.use(rateLimit(limitConfig));
  // register all bot commands, actions, etc
  await registerHandlers(bot);
  // register global error handler to prevent the bot from stopping after an exception
  bot.catch((err: any, ctx: Context) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });
  bot.launch();
  console.log("bitcoin_dog_bot started! ");
}

main();
