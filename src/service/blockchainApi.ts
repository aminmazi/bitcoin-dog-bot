import axios from "axios";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import env from "../utils/env";
import moment from "moment";

export async function getPrice(currency = "USD"): Promise<number> {
  switch (currency) {
    case "USD":
      return await getPriceInUSD();
    case "IRT":
      return await getPriceIRT();
    case "USDT": // get price of usdt in IRT
      return await getPriceOfUSDT();
  }
  // normally shouldn't reach here
  throw new Error("failed to get price");
}

async function getPriceInUSD(): Promise<number> {
  let price = cache?.get<number>(CACHE_KEYS.PRICE);
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    price = await axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then((res) => res.data.bpi.USD.rate_float);

    cache?.set(CACHE_KEYS.PRICE, price, env.CACHE_INTERVAL);
    //set history for 24 hours change calculation
    savePriceHistory(price, "USD");
  }
  if (!price) {
    throw new Error("failed to get price");
  }
  return price;
}

function savePriceHistory(price: number | undefined, currency: string) {
  const dayNumber = moment().date() % 2; //for even/odd days
  const historyCacheKey = `history_${currency}_${dayNumber}_${moment().hour()}`;
  if (!cache?.get<number>(historyCacheKey)) {
    cache?.set(historyCacheKey, price, 3600 * 25);
  }
}

async function getPriceIRT(): Promise<number> {
  let price = cache?.get<number>(CACHE_KEYS.PRICE_IRT);
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    // price = await axios
    //   .get("https://ramzinex.com/exchange/api/exchange/prices")
    //   .then(res => res.data.original.btcirr.sell / 10);

    price = await axios
      .post("https://api.nobitex.ir/market/stats", {
        srcCurrency: "btc",
        dstCurrency: "rls",
      })
      .then((res) => res.data.stats["btc-rls"].latest / 10);

    cache?.set(CACHE_KEYS.PRICE_IRT, price, env.CACHE_INTERVAL);
    //set history for 24 hours change calculation
    savePriceHistory(price, "IRT");
  }
  if (!price) {
    throw new Error("failed to get price IRT");
  }
  return price;
}

async function getPriceOfUSDT(): Promise<number> {
  let price = cache?.get<number>(CACHE_KEYS.PRICE_USDT);
  if (!price) {
    price = await axios
      .post("https://api.nobitex.ir/market/stats", {
        srcCurrency: "usdt",
        dstCurrency: "rls",
      })
      .then((res) => res.data.stats["usdt-rls"].latest / 10);

    cache?.set(CACHE_KEYS.PRICE_USDT, price, env.CACHE_INTERVAL);
    //set history for 24 hours change calculation
    savePriceHistory(price, "USDT");
  }
  if (!price) {
    throw new Error("failed to get price USDT");
  }
  return price;
}

export async function getPriceChange(currency = "USD"): Promise<number> {
  // 1. get current price
  let currentPrice = await getPrice();

  const yesterdayNumber = moment().date() % 2 === 0 ? 1 : 0;

  const historyCacheKey = `history_${currency}_${yesterdayNumber}_${moment().hour()}`;

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

export async function getPriceForCurrency(currency: string): Promise<Number> {
  if (currency.toUpperCase() === "USD")
    return Number((await getPrice("USD")).toFixed(0));
  else if (currency.toUpperCase() === "IRT")
    return Number((await getPrice("IRT")).toFixed(0));
  // normally shouldn't reach here
  throw new Error("failed to get price");
}
