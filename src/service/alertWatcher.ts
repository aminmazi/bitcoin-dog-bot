import Alert from "../models/alert";
import { getPriceForCurrency } from "../service/blockchainApi";
import Telegraf, { ContextMessageUpdate } from "telegraf";
import { str, KEYS } from "../locals";
import User from "../models/user";

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
  //@ts-ignore
  bot.context.user = (await User.findOne({ chatId: alert.chatId })) || {
    language: "fa",
  };
  await bot.telegram.sendMessage(
    alert.chatId,
    str(bot.context, KEYS.ALERT_FIRE, [alert, price]),
  );
  await Alert.updateOne(alert, { enabled: false });
}
