import taapi from "taapi";
import env from "../utils/env";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";

export interface RsiResult {
  rsi: number;
  suggestion: SUGGESTION;
}

export enum SUGGESTION {
  STRONG_SELL = 4,
  SELL = 3,
  NEUTRAL = 2,
  BUY = 1,
  STRONG_BUY = 0,
}

export async function getRSI(interval: string): Promise<RsiResult> {
  //first check the cache
  let rsiResult = cache?.get<RsiResult>(`${CACHE_KEYS.TA_RSI}_${interval}`);
  if (!rsiResult) {
    const client = taapi.client(env.TAAPI);
    let result;
    try {
      result = await client.getIndicator(
        "rsi",
        "binance",
        "BTC/USDT",
        interval,
      );
    } catch (error) {
      console.log("error in taapi", error);
    }
    if (!result.value) result = { value: 50 };
    rsiResult = {
      rsi: result.value,
      suggestion: generateSuggestionFromRsi(result.value),
    };
    cache?.set(`${CACHE_KEYS.TA_RSI}_${interval}`, rsiResult, 3600);
  }
  return rsiResult;
}

function generateSuggestionFromRsi(rsi: number) {
  switch (true) {
    case rsi < 30:
      return SUGGESTION.STRONG_BUY;
    case rsi >= 30 && rsi <= 40:
      return SUGGESTION.BUY;
    case rsi > 40 && rsi < 60:
      return SUGGESTION.NEUTRAL;
    case rsi >= 60 && rsi <= 70:
      return SUGGESTION.SELL;
    case rsi > 70:
      return SUGGESTION.STRONG_SELL;
    default:
      return SUGGESTION.NEUTRAL;
  }
}

export function getSuggestionString(sug: SUGGESTION) {
  switch (sug) {
    case SUGGESTION.BUY:
      return "Buy";
    case SUGGESTION.NEUTRAL:
      return "Neutral";
    case SUGGESTION.SELL:
      return "Sell";
    case SUGGESTION.STRONG_BUY:
      return "Strong Buy";
    case SUGGESTION.STRONG_SELL:
      return "Strong Sell";
  }
}
