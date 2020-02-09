import taapi from "taapi";
import env from "../utils/env";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import { str, KEYS } from "../locals";
import { ContextMessageUpdate } from "telegraf/typings";

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
    cache?.set(`${CACHE_KEYS.TA_RSI}_${interval}`, rsiResult, env.TAAPI_CACHE_INTERVAL);
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

export function getSuggestionString(ctx: ContextMessageUpdate, sug: SUGGESTION) {
  switch (sug) {
    case SUGGESTION.BUY:
      return str(ctx, KEYS.BUY);
    case SUGGESTION.NEUTRAL:
      return str(ctx, KEYS.NEUTRAL);
    case SUGGESTION.SELL:
      return str(ctx, KEYS.SELL);
    case SUGGESTION.STRONG_BUY:
      return str(ctx, KEYS.STRONG_BUY);
    case SUGGESTION.STRONG_SELL:
      return str(ctx, KEYS.STRONG_SELL);
  }
}
