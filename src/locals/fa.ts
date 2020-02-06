import { KEYS } from ".";
import { COMMANDS } from "../utils/consts";

export function strFa(name: KEYS, params: any[]) {
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
  }
}
