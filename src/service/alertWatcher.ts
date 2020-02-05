import Alert from "../models/alert";
import { getPriceForCurrency } from "../service/blockchainApi";
import Telegraf, { ContextMessageUpdate } from "telegraf";

export default async function watcher(bot: Telegraf<ContextMessageUpdate>) {
  const alerts = await Alert.find({ enabled: true });
  console.log(
    `watcher service started another round with ${alerts.length} enabled alerts`,
  );
  alerts.forEach(async function(alert) {
    const price = await getPriceForCurrency(alert.currency);
    if (alert.alertUp) {
      if (alert.to <= price) {
        // send alert to user
        await sendAlert(bot, alert, price);
        return;
      }
    }
    // alert is not of type up
    else {
      if (alert.to >= price) {
        // send alert to user
        await sendAlert(bot, alert, price);
        return;
      }
    }
  });
  setTimeout(async function() {
    await watcher(bot);
  }, 60000);
}

async function sendAlert(
  bot: Telegraf<ContextMessageUpdate>,
  alert: Alert,
  price: Number,
) {
  await bot.telegram.sendMessage(
    alert.chatId,
    `🚨 Alert! bitcoin price went ${
      alert.alertUp ? "up" : "down"
    } to ${price.toLocaleString()} ${alert.currency}`,
  );
  await Alert.updateOne(alert, { enabled: false });
}
