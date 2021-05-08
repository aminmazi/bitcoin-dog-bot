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
      
<i> 📈 زمانی که قیمت به مقدار مورد نظر من رسید به من خبر بده! ← /${params[0]}</i>

<i> 📈 زمانی که تراکنشهای تایید نشده کمتر از مقدار تعیین شده بود به من خبر بده! ← /${params[1]}</i>`;

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
      return `<b>💰 قیمت به دلار:  ${params[0]} ${
        params[2] >= 0 ? ` %${params[2]}+ ✅` : ` %${params[2]} 🔻`
      }
      
${params[1]} تومان ${
  params[5] >= 0 ? ` %${params[5]}+ ✅` : ` %${params[5]} 🔻`
}</b>
      
<b>تتر 🇺🇸:  ${params[4]} تومان ${
  params[6] >= 0 ? ` %${params[6]}+ ✅` : ` %${params[6]} 🔻`
}</b>
      
${
  params[3]
    ? `<b>⏳ تراکنش های بیتکوین در صف تایید: ${params[3].toLocaleString()}</b>`
    : ""
}

<b>💰 اتر به دلار:  ${params[8]} ${
  params[10] >= 0 ? ` %${params[10]}+ ✅` : ` %${params[10]} 🔻`
}</b>

<b>اتر به تومان:  ${params[7]} ${
  params[9] >= 0 ? ` %${params[9]}+ ✅` : ` %${params[9]} 🔻`
}</b>`;

    case KEYS.ALERT_HELP:
      return `<b>نحوه استفاده:
/alert [قیمت] [واحد پولی]
نمونه مثال:</b>

<b>/alert ${params[0] + 50} USD</b>
  
<b>/alert ${params[1] + 1000000} IRT</b>
  
<b>قیمت مورد نظر خود را بالاتر  یا پایین تر از قیمت فعلی بیتکوین وارد کنید تا در زمانی که قیمت بیتکوین از مقدار مشخص شده شما عبور کرد به شما اطلاع داده شود!</b>`;

    case KEYS.MEMPOOL_ALERT_HELP:
      return `<b>نحوه استفاده:
/alert_mempool  [تعداد مورد نظر]
نمونه مثال:</b>

<b>/alert_mempool 2000</b>
  
<b>برای مثال هر گاه تعداد تراکنشهای تایید نشده کمتر از ۲۰۰۰ بود به شما خبر می‌دهد!</b>`;

    case KEYS.ALERT_SET:
      return `<b>هشدار تنظیم شد.
 زمانی که قیمت بیتکوین به مقدار  ${params[1].toLocaleString()} ${params[2]} ${
        params[0] ? "صعود کند" : "سقوط کند"
      }، شما هشدار دریافت خواهید کرد.</b>`;

    case KEYS.MEMPOOL_ALERT_SET:
      return `<b>هشدار تنظیم شد.
 زمانی که تعداد تراکنشهای تایید نشده به مقدار  ${params[0].toLocaleString()} ${"سقوط کند"}، شما هشدار دریافت خواهید کرد.</b>`;

    case KEYS.ALERT_FIRE:
      const price = Number((params[1] as number).toFixed(0)).toLocaleString()
      return ` 🚨
قیمت بیتکوین به مقدار ${price} ${params[0].currency}
${params[0].alertUp ? "افزایش" : "کاهش"} یافت.`;

    case KEYS.MEMPOOL_ALERT_FIRE:
      return ` 🚨
تعداد تراکنشهای تایید نشده به مقدار ${params[0].toLocaleString()}
کاهش یافت`;

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

<b>شاخص (Stochastic): ${params[0][1].value} - ${params[0][1].suggestion}</b>

<b>تحلیل کلی: ${params[2]}</b>`;
  }
}
