import axios from "axios";
import { cache } from "./cache";
import { CACHE_KEYS } from "./consts";
import env from "./env";

export async function getPrice(): Promise<number> {
  let price = cache?.get<number>(CACHE_KEYS.PRICE);
  if (!price) {
    //if price doesn't exist on cache, fetch price from api
    price = await axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(res => res.data.bpi.USD.rate_float);

    cache?.set(CACHE_KEYS.PRICE, price, env.CACHE_INTERVAL);
  }
  if (!price) {
    throw new Error("failed to get price");
  }
  return price;
}

export async function getNumOfUnconfirmed(): Promise<number> {
  let numOfUnconfirmed = cache?.get<number>(CACHE_KEYS.NUM_OF_UNCONFIRMED);
  if (!numOfUnconfirmed) {
    //if price doesn't exist on cache, fetch price from api
    numOfUnconfirmed = await axios
      .get("https://blockchain.info/q/unconfirmedcount")
      .then(res => res.data);

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
