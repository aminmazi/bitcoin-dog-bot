import { getPrice } from "./blockchainApi";
import fs from "fs";
import { cache } from "../utils/cache";

export default async function fillCacheEveryHour() {
  getPrice("USD");
  getPrice("USDT");
  getPrice("IRT");
  setTimeout(async function () {
    await fillCacheEveryHour();
  }, 3600 * 1000);
}

export function initilizeHistoryCache() {
  try {
    const latestCache = JSON.parse(
      fs.readFileSync("./src/latestCache.json", "utf8"),
    );
    Object.keys(latestCache).forEach((key) => {
      cache?.set(
        key,
        latestCache[key as keyof typeof latestCache].v,
        24 * 3600,
      );
    });
  } catch (error) {
    console.error(error);
  }
}
