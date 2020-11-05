import axios from "axios";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import env from "../utils/env";

export async function getPrice(currency = "USD"): Promise<number> {
  switch (currency) {
    case "USD":
      return await getPriceInUSD();
    case "IRT":
      return await getPriceIRT();
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
  }
  if (!price) {
    throw new Error("failed to get price");
  }
  return price;
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
  }
  if (!price) {
    throw new Error("failed to get price IRT");
  }
  return price;
}

export async function getPriceChange(): Promise<number> {
  // 1. get current price
  let currentPrice = await getPrice();

  // 2. get 24 hours ago price
  let change = cache?.get<number>(CACHE_KEYS.PRICE_CHANGE);
  if (!change) {
    //if price doesn't exist on cache, fetch price from api
    const res = await axios
      .get("https://api.coindesk.com/v1/bpi/historical/close.json")
      .then((res) => res.data.bpi);

    const priceOfYesterday = res[Object.keys(res)[Object.keys(res).length - 1]];

    change = ((currentPrice - priceOfYesterday) / priceOfYesterday) * 100;

    cache?.set(CACHE_KEYS.PRICE_CHANGE, change, env.CACHE_INTERVAL);
  }
  if (!change) {
    throw new Error("failed to get change");
  }
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
