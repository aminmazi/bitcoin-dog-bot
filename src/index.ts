import Telegraf, { Context } from "telegraf";
import env from "./utils/env";
import { registerHandlers } from "./handlers";
import mongoose from "mongoose";
import rateLimit from "telegraf-ratelimit";
import { createInstance as initCacheInstance } from "./utils/cache";
import { attachUser } from "./middlewares/attachUser";
import alertWatcher from "./service/alertWatcher";
import winston from "winston";
import { Loggly } from "winston-loggly-bulk";
// import taapi from "taapi";

// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 60000,
  limit: 40,
  onLimitExceeded: (ctx: any) => ctx.reply("Rate limit exceeded"),
};

async function main() {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
    defaultMeta: { service: "bitcoin-dog-bot" },
    transports: [
      new Loggly({
        token: env.LOG_PASSWORD,
        subdomain: env.LOG_USERNAME,
        tags: ["bitcoin-dog-bot"],
        json: true,
      }),
      new winston.transports.Console(),
    ],
  });

  logger.log("info", "Hello World from bitcoin dog bot!");
  // Connect to mongoose
  mongoose.connect(
    env.MONGO,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        logger.error(err.message);
        logger.error(err);
      } else {
        logger.error("Connected to MongoDB");
      }
    },
  );

  mongoose.set("useCreateIndex", true);
  let bot = new Telegraf(env.BOT_TOKEN);
  bot.context.logger = logger;
  //init cache
  initCacheInstance();
  //rate limit
  bot.use(rateLimit(limitConfig));
  //attach user
  bot.use(attachUser);
  // register all bot commands, actions, etc
  await registerHandlers(bot);
  // register global error handler to prevent the bot from stopping after an exception
  bot.catch((err: any, ctx: Context) => {
    logger.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });
  bot.launch();
  // run alert service
  alertWatcher(bot);
  logger.info("bitcoin_dog_bot started! ");
  // const client = taapi.client(env.TAAPI);
  // let result;
  // try {
  //   result = await client.getIndicator("stoch", "binance", "BTC/USDT", "1h", {
  //     optInSlowK_Period: 14,
  //   });
  // } catch (error) {
  //   console.log("error in taapi", error);
  // }
  // console.log(result);
}

main();
