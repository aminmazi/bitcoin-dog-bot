import { KEYS } from ".";
import { COMMANDS } from "../utils/consts";

export function strFa(name: KEYS, params: any[] = []) {
  switch (name) {
    case KEYS.MENU:
      return `<b>یکی از گزینه های زیر را انتخاب کنید. برای دیدن بقیه صفحات منو، از دکمه های پایین استفاده نمایید.</b>

<i> ℹ️ قیمت فعلی بیتکوین ← /${params[0]}</i>
        
<i> 🧠 دریافت تحلیل تکنیکال ← /${params[1]}</i>`;

    case KEYS.ALERT_MENU:
      return `<strong>هشدارها 🔔</strong>
<b>هشدار جدید ایجاد کنید تا در زمانی که قیمت به مقدار مورد نظر برسد به شما خبر داده شود.</b>
      
<i> 📈 زمانی که قیمت به مقدار مورد نظر من رسید به من خبر بده! ← /${params[0]}</i>`;

    case KEYS.STATS_MENU:
      return `<strong>آمار ℹ️</strong>

<i> ℹ️ قیمت فعلی بیتکوین ← /${params[0]}</i>
      
<i> 🧠 دریافت تحلیل تکنیکال ← /${params[1]}</i>`;

    case KEYS.ALERTS:
      return `هشدارها`;

    case KEYS.STATS:
      return `آمار`;

    case KEYS.LANG_CHANGED:
      return `<b>زبان با موفقیت به فارسی تغییر یافت.</b>
<b>For changing language again run /${COMMANDS.LANG}</b>`;

    case KEYS.STATS_COMMAND:
      return `<b>💰 قیمت به دلار:  ${params[0]}
🇮🇷 ${params[1]} تومان </b>
      
<b>📈 تغییر در ۲۴ ساعت:${
        params[2] >= 0 ? ` %${params[2]}+ ✅` : ` %${params[2]} 🔻`
      } </b>
      
${
  params[3]
    ? `<b>⏳ تراکنش های در صف تایید: ${params[3].toLocaleString()}</b>`
    : ""
}`;

    case KEYS.ALERT_HELP:
      return `<b>نحوه استفاده:
/alert [قیمت] [واحد پولی]
نمونه مثال:</b>

<b>/alert ${params[0] + 50} USD</b>
  
<b>/alert ${params[1] + 1000000} IRT</b>
  
<b>قیمت مورد نظر خود را بالاتر  یا پایین تر از قیمت فعلی بیتکوین وارد کنید تا در زمانی که قیمت بیتکوین از مقدار مشخص شده شما عبور کرد به شما اطلاع داده شود!</b>`;

    case KEYS.ALERT_SET:
      return `<b>هشدار تنظیم شد.
 زمانی که قیمت بیتکوین به مقدار  ${params[1].toLocaleString()} ${params[2]} ${
        params[0] ? "صعود کند" : "سقوط کند"
      }، شما هشدار دریافت خواهید کرد.</b>`;

    case KEYS.ALERT_FIRE:
      return ` 🚨
قیمت بیتکوین به مقدار ${params[1].toLocaleString()} ${params[0].currency}
${params[0].alertUp ? "افزایش" : "کاهش"} یافت.`;

    case KEYS.BUY:
      return `خرید 🟢`;

    case KEYS.NEUTRAL:
      return `خنثی ⚪️`;

    case KEYS.SELL:
      return `فروش 🔴`;

    case KEYS.STRONG_BUY:
      return `خرید قوی 🟢`;

    case KEYS.STRONG_SELL:
      return `فروش قوی 🔴`;

    case KEYS.TA_MESSAGE:
      return `<b>تحلیل تکنیکال برای بازه زمانی ${params[1]} 👇</b>

<b>شاخص (RSI): ${params[0][0].value} - ${params[0][0].suggestion}</b>

<b>تحلیل کلی: ${params[2]}</b>`;
  }
}
