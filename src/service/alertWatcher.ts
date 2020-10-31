import Alert, { ALERT_TYPES } from "../models/alert";
import {
  getPriceForCurrency,
  getNumOfUnconfirmed,
} from "../service/blockchainApi";
import { str, KEYS } from "../locals";
import User from "../models/user";
import { TelegrafContext } from "telegraf/typings/context";
import Telegraf from "telegraf";

export default async function watcher(bot: Telegraf<TelegrafContext>) {
  const priceAlerts = await Alert.find({
    enabled: true,
    $or: [{ type: ALERT_TYPES.PRICE }, { type: { $exists: false } }],
  });
  console.log(
    `watcher service started another round for price alerts with ${priceAlerts.length} enabled alerts`,
  );
  priceAlerts.forEach(async function (alert) {
    const price = await getPriceForCurrency(alert.currency || "BTC");
    if (alert.alertUp) {
      if (alert.to <= price) {
        // send alert to user
        await sendPriceAlert(bot, alert, price);
        return;
      }
    }
    // alert is not of type up
    else {
      if (alert.to >= price) {
        // send alert to user
        await sendPriceAlert(bot, alert, price);
        return;
      }
    }
  });
  // mempool alerts
  const memPoolAlerts = await Alert.find({
    enabled: true,
    type: ALERT_TYPES.MEMPOOL,
  });
  console.log(
    `watcher service started another round for mempool alerts with ${memPoolAlerts.length} enabled alerts`,
  );
  memPoolAlerts.forEach(async function (alert) {
    const unconfirmedNum = await getNumOfUnconfirmed();
    if (alert.to > unconfirmedNum) {
      await sendMempoolAlert(bot, alert, unconfirmedNum);
      return;
    }
  });
  setTimeout(async function () {
    await watcher(bot);
  }, 60000);
}

async function sendPriceAlert(
  bot: Telegraf<TelegrafContext>,
  alert: Alert,
  price: Number,
) {
  //@ts-ignore
  bot.context.user = (await User.findOne({ chatId: alert.chatId })) || {
    language: "fa",
  };
  try {
    await bot.telegram.sendMessage(
      alert.chatId || 0,
      str(bot.context, KEYS.ALERT_FIRE, [alert, price]),
    );
  } catch (error) {
    console.log(error);
  } finally {
    await alert.updateOne({ enabled: false });
  }
}

async function sendMempoolAlert(
  bot: Telegraf<TelegrafContext>,
  alert: Alert,
  num: Number,
) {
  //@ts-ignore
  bot.context.user = await User.findOne({ chatId: alert.chatId });
  try {
    await bot.telegram.sendMessage(
      alert.chatId || 0,
      str(bot.context, KEYS.MEMPOOL_ALERT_FIRE, [num]),
    );
  } catch (error) {
    console.log(error);
  } finally {
    await alert.updateOne({ enabled: false });
  }
}
