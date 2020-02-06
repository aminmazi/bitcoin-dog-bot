import { KEYS } from ".";
import { COMMANDS } from "../utils/consts";

export function strEn(name: KEYS, params: any[]) {
  switch (name) {
    case KEYS.MENU:
      return `<b>Choose one of the commands on the menu or switch to another category using the buttons below the menu.</b>

<i>/${params[0]} → Get current bitcoin status ℹ️</i>
        
<i>/${params[1]} → Get technical analysis 🧠</i>`;

    case KEYS.ALERT_MENU:
      return `<strong>Alerts 🔔</strong>
<b>You can set an alert and we will send you a message when an alert is triggered.</b>
      
<i>/${params[0]} 📈 → Notify me when bitcoin price crosses a specified value </i>`;

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
  }
}
