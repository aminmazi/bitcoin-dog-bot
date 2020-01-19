import Telegraf, { ContextMessageUpdate } from "telegraf";
import { cache } from "../utils/cache";
import axios from "axios";

export default async function registerPrice(
  bot: Telegraf<ContextMessageUpdate>,
) {
  bot.command("price", printPriceCommand);
}

async function printPriceCommand(ctx: ContextMessageUpdate) {
  // first get price from cache
  let price = cache?.get("price");
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    const response = await axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(res => res.data);
    price = Number((response.bpi.USD.rate_float as number).toFixed(0)).toLocaleString();
    cache?.set("price", price, 120);
  }
  return ctx.reply(`${price} USD`);
}
