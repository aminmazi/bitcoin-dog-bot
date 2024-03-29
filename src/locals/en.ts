import { KEYS } from ".";
import { COMMANDS } from "../utils/consts";

export function strEn(name: KEYS, params: any[] = []) {
  switch (name) {
    case KEYS.MENU:
      return `<b>Choose one of the commands on the menu or switch to another category using the buttons below the menu.</b>

<i>/${params[0]} → Get current bitcoin status ℹ️</i>
        
<i>/${params[1]} → Get technical analysis 🧠</i>`;

    case KEYS.ALERT_MENU:
      return `<strong>Alerts 🔔</strong>
<b>You can set an alert and we will send you a message when an alert is triggered.</b>
      
<i>/${params[0]} 📈 → Notify me when bitcoin price crosses a specified value </i>

<i>/${params[1]} 🏦 → Notify me when unconfirmed transactions are less than a specified value </i>`;

    case KEYS.STATS_MENU:
      return `<strong>Stats ℹ️</strong>

<i>/${params[0]} → Get current bitcoin status ℹ️</i>
      
<i>/${params[1]} → Get technical analysis 🧠</i>`;

    case KEYS.ALERTS:
      return `Alerts`;

    case KEYS.STATS:
      return `Stats`;

    case KEYS.LANG_CHANGED:
      return `<b>Language successfully changed to english.</b>
<b>For changing language again run /${COMMANDS.LANG}</b>`;

    case KEYS.STATS_COMMAND:
      return `<b>🅑 $${params[0]} ${
        params[2] >= 0 ? `✅ +${params[2]}` : `🔻 ${params[2]}`
      }%

🅑 ${params[1]} IRT ${
  params[5] >= 0 ? `✅ +${params[5]}` : `🔻 ${params[5]}`
}%</b>
      
<b>🇺🇸 USDT: ${params[4]} IRT ${
  params[6] >= 0 ? `✅ +${params[6]}` : `🔻 ${params[6]}`
}%</b>
      
${
  params[3]
    ? `<b>⏳ Unconfirmed BTC TXs: ${params[3].toLocaleString()}</b>`
    : ""
}

<b>ETH $${params[8]} ${
  params[10] >= 0 ? `✅ +${params[10]}` : `🔻 ${params[10]}`
}%</b>

<b>ETH ${params[7]} IRT ${
  params[9] >= 0 ? `✅ +${params[9]}` : `🔻 ${params[9]}`
}%</b>`;

    case KEYS.ALERT_HELP:
      return `<b>Usage template: /alert [value] [currency]
for example:</b>

<b>/alert ${params[0] + 50} USD</b>
  
<b>/alert ${params[1] + 1000000} IRT</b>
  
<b>Enter a price above/below the current bitcoin price and you'll receive an alert the first time bitcoin cross this number!</b>`;

    case KEYS.MEMPOOL_ALERT_HELP:
      return `<b>Usage template: /alert_mempool [value]
for example:</b>

<b>/alert_mempool 2000</b>
  
<b>it will inform you when number of unconfirmed transactions is less than 2000</b>`;

    case KEYS.ALERT_SET:
      return `<b>Alarm has been set.
You'll be notified the first time price goes ${
        params[0] ? "up" : "down"
      } to ${params[1].toLocaleString()} ${params[2]} .</b>`;

    case KEYS.MEMPOOL_ALERT_SET:
      return `<b>Alarm has been set.
You'll be notified the first time number of mempool txs goes down to ${params[0].toLocaleString()} .</b>`;

    case KEYS.ALERT_FIRE:
      const price = Number((params[1] as number).toFixed(0)).toLocaleString()
      return `🚨 
bitcoin price went ${
        params[0].alertUp ? "up" : "down"
      } to ${price} ${params[0].currency}`;

    case KEYS.MEMPOOL_ALERT_FIRE:
      return `🚨 
unconfirmed transactions number went down to ${params[0].toLocaleString()}`;

    case KEYS.BUY:
      return `Buy 🟢`;

    case KEYS.NEUTRAL:
      return `Neutral ⚪️`;

    case KEYS.SELL:
      return `Sell 🔴`;

    case KEYS.STRONG_BUY:
      return `Strong Buy 🟢`;

    case KEYS.STRONG_SELL:
      return `Strong Sell 🔴`;

    case KEYS.TA_MESSAGE:
      return `<b>Technical analysis for ${params[1]} 👇</b>

<b>RSI : ${params[0][0].value} - ${params[0][0].suggestion}</b>

<b>Stochastic : ${params[0][1].value} - ${params[0][1].suggestion}</b>

<b>Overall suggestion: ${params[2]}</b>`;
  }
}
