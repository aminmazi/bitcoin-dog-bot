import taapi from "taapi";
import env from "../utils/env";
import { cache } from "../utils/cache";
import { CACHE_KEYS } from "../utils/consts";
import { str, KEYS } from "../locals";
import { TelegrafContext } from "telegraf/typings/context";

export interface RsiResult {
  rsi: number;
  suggestion: SUGGESTION;
}

export interface StochResult {
  result: { valueSlowK: number; valueSlowD: number };
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
    rsiResult = {
      rsi: result.value || 50,
      suggestion: generateSuggestionFromRsi(result.value || 50),
    };
    cache?.set(
      `${CACHE_KEYS.TA_RSI}_${interval}`,
      rsiResult,
      env.TAAPI_CACHE_INTERVAL,
    );
  }
  return rsiResult;
}

export async function getStoch(interval: string): Promise<StochResult> {
  //first check the cache
  let stochResult = cache?.get<StochResult>(
    `${CACHE_KEYS.TA_STOCH}_${interval}`,
  );
  if (!stochResult) {
    const client = taapi.client(env.TAAPI);
    let result: StochResult["result"] = { valueSlowD: 50, valueSlowK: 50 };
    try {
      result = (await client.getIndicator(
        "stoch",
        "binance",
        "BTC/USDT",
        interval,
        {
          optInSlowK_Period: 14,
        },
      )) || { valueSlowD: 50, valueSlowK: 50 };
    } catch (error) {
      console.log("error in taapi", error);
    }
    if (!result.valueSlowD || !result.valueSlowK)
      result = { valueSlowD: 50, valueSlowK: 50 };
    stochResult = {
      result,
      suggestion: generateSuggestionFromStoch(result),
    };
    cache?.set(
      `${CACHE_KEYS.TA_STOCH}_${interval}`,
      stochResult,
      env.TAAPI_CACHE_INTERVAL,
    );
  }
  return stochResult;
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

function generateSuggestionFromStoch(result: StochResult["result"]) {
  const { valueSlowD, valueSlowK } = result;
  switch (true) {
    case valueSlowD <= 20 && valueSlowK <= 20 && valueSlowK > valueSlowD:
      return SUGGESTION.STRONG_BUY;
    case valueSlowD >= 80 && valueSlowK >= 80 && valueSlowK < valueSlowD:
      return SUGGESTION.STRONG_SELL;
    case valueSlowD <= 80 && valueSlowK >= 20 && valueSlowK > valueSlowD:
      return SUGGESTION.BUY;
    case valueSlowD <= 80 && valueSlowK >= 20 && valueSlowK < valueSlowD:
      return SUGGESTION.SELL;
    default:
      return SUGGESTION.NEUTRAL;
  }
}

export function getSuggestionString(
  ctx: TelegrafContext,
  sug: SUGGESTION,
) {
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
