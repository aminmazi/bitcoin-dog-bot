import { getPrice } from "./blockchainApi";

export default async function fillCacheEveryHour() {
  getPrice("USD");
  getPrice("USDT");
  getPrice("IRT");
  setTimeout(async function () {
    await fillCacheEveryHour();
  }, 3600 * 1000);
}