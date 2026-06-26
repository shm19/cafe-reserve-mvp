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

/** Format Toman amounts, e.g. 1200000 -> "۱٬۲۰۰٬۰۰۰ تومان". */
export function toman(amount: number): string {
  return `${faNum(amount.toLocaleString("en-US"))} تومان`;
}
