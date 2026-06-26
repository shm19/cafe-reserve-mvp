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

/** Format Toman amounts, e.g. 1200000 -> "۱٬۲۰۰٬۰۰۰ تومان". */
export function toman(amount: number): string {
  return `${faNum(amount.toLocaleString("en-US"))} تومان`;
}
