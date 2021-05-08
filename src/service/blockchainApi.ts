import axios from "axios";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import env from "../utils/env";
import moment from "moment";

export async function getPrice(currency = "USD"): Promise<number> {
  switch (currency) {
    // BTC in USD
    case "USD":
      return await getBtcPriceInUSD();
    // BTC in IRT
    case "IRT":
      return await getCoinPriceFromNobitex("btc", "rls");
    // USDT in IRT
    case "USDT":
      return await getCoinPriceFromNobitex("usdt", "rls");
  }
  // normally shouldn't reach here
  throw new Error("failed to get price");
}

async function getBtcPriceInUSD(): Promise<number> {
  const cacheKey = `btc_To_usd`;
  let price = cache?.get<number>(cacheKey);
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    price = await axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => res.data.bpi.USD.rate_float);

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
  const cacheKey = `${from}_To_${to}`;
  let price = cache?.get<number>(cacheKey);
  if (!price) {
    price = await axios
      .post("https://api.nobitex.ir/market/stats", {
        srcCurrency: from,
        dstCurrency: to,
      })
      .then((res) => res.data.stats[`${from}-${to}`].latest / 10);

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
