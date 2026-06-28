import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with Persian digits. */
export function faNum(value: number | string): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(value).replace(/\d/g, (d) => map[Number(d)]);
}

/** Normalise Persian/Arabic digits to ASCII (for inputs the user types into). */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** Pretty Iranian mobile for display, e.g. "09123456789" -> "۰۹۱۲ ۳۴۵ ۶۷۸۹". */
export function formatPhone(phone: string): string {
  const grouped = phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  return faNum(grouped);
}

/** Human distance in Persian, e.g. 400 -> "۴۰۰ متر", 1200 -> "۱٫۲ کیلومتر". */
export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${faNum((meters / 1000).toFixed(1))} کیلومتر`;
  return `${faNum(meters)} متر`;
}

/** Format an ISO date in the Persian (Jalali) calendar, e.g. "۲ تیر ۱۴۰۵".
 *  Uses the browser's Intl support — no date library needed. */
export function faDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Jalali weekday + day + month with the time, e.g. "پنجشنبه ۵ تیر · ۱۸:۳۰". */
export function faDateTime(iso: string): string {
  try {
    const date = new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(iso));
    const time = faNum(iso.slice(11, 16)); // HH:MM straight from the string
    return `${date} · ${time}`;
  } catch {
    return iso;
  }
}

/** Format Toman amounts, e.g. 1200000 -> "۱٬۲۰۰٬۰۰۰ تومان". */
export function toman(amount: number): string {
  return `${faNum(amount.toLocaleString("en-US"))} تومان`;
}
