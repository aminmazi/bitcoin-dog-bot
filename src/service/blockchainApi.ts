import axios from "axios";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import env from "../utils/env";
import moment from "moment";
import { logger } from "../utils/logger";

export async function getPrice(currency = "USD"): Promise<number> {
  switch (currency) {
    // BTC in USD
    case "USD":
    case "btc_TO_usd":
      return await getBtcPriceInUSD();
    // BTC in IRT
    case "IRT":
    case "btc_TO_rls":
      return await getCoinPriceFromNobitex("btc", "rls");
    // USDT in IRT
    case "USDT":
    case "usdt_TO_rls":
      return await getCoinPriceFromNobitex("usdt", "rls");
    case "ETH-USD":
    case "eth_TO_usdt":
      return await getCoinPriceFromNobitex("eth", "usdt");
    case "ETH-IRT":
    case "eth_TO_rls":
      return await getCoinPriceFromNobitex("eth", "rls");
  }
  // normally shouldn't reach here
  logger.error(`failed to get price for ${currency}`);
  throw new Error("failed to get price");
}

async function getBtcPriceInUSD(): Promise<number> {
  const cacheKey = `btc_TO_usd`;
  let price = cache?.get<number>(cacheKey);
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    price = await axios
      .get("https://blockchain.info/ticker")
      .then((res) => res.data.USD["15m"]);

    cache?.set(cacheKey, price, env.CACHE_INTERVAL);
    //set history for 24 hours change calculation
    savePriceHistory(price, cacheKey);
  }
  if (!price) {
    throw new Error("failed to get price");
  }
  return price;
}

function savePriceHistory(price: number | undefined, pair: string) {
  const dayNumber = moment().date() % 2; //for even/odd days
  const historyCacheKey = `history_${pair}_${dayNumber}_${moment().hour()}`;
  if (!cache?.get<number>(historyCacheKey)) {
    cache?.set(historyCacheKey, price, 3600 * 25);
  }
}

async function getCoinPriceFromNobitex(
  from: string,
  to: string,
): Promise<number> {
  const cacheKey = `${from}_TO_${to}`;
  let price = cache?.get<number>(cacheKey);
  if (!price) {
    price = await axios
      .post("https://api.nobitex.ir/market/stats", {
        srcCurrency: from,
        dstCurrency: to,
      })
      .then((res) => {
        let divider = 1;
        if (to === "rls") {
          // convert rls to IRT
          divider = 10;
        }
        return res.data.stats[`${from}-${to}`].latest / divider;
      });

    cache?.set(cacheKey, price, env.CACHE_INTERVAL);
    //set history for 24 hours change calculation
    savePriceHistory(price, cacheKey);
  }
  if (!price) {
    throw new Error(`failed to get price ${cacheKey}`);
  }
  return price;
}

export async function getPriceChange(pair = "btc_To_usd"): Promise<number> {
  // 1. get current price
  let currentPrice = await getPrice(pair);

  const yesterdayNumber = moment().date() % 2 === 0 ? 1 : 0;

  const historyCacheKey = `history_${pair}_${yesterdayNumber}_${moment().hour()}`;

  const priceOfYesterday = cache?.get<number>(historyCacheKey) || currentPrice;

  const change = ((currentPrice - priceOfYesterday) / priceOfYesterday) * 100;

  return change;
}

export async function getNumOfUnconfirmed(): Promise<number> {
  let numOfUnconfirmed = cache?.get<number>(CACHE_KEYS.NUM_OF_UNCONFIRMED);
  if (!numOfUnconfirmed) {
    //if price doesn't exist on cache, fetch price from api
    numOfUnconfirmed = await axios
      .get("https://blockchain.info/q/unconfirmedcount")
      .then((res) => res.data);

    cache?.set(
      CACHE_KEYS.NUM_OF_UNCONFIRMED,
      numOfUnconfirmed,
      env.CACHE_INTERVAL,
    );
  }
  if (!numOfUnconfirmed) {
    throw new Error("failed to get numOfUnconfirmed");
  }
  return numOfUnconfirmed;
}
