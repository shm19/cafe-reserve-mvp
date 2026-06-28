import { z } from "zod";
import { TAG_META } from "@/lib/tags";
import { toEnglishDigits } from "@/lib/utils";
import type { CafeTag } from "@/types";

const TAG_VALUES = Object.keys(TAG_META) as [CafeTag, ...CafeTag[]];

/** Persian/Arabic digits → number; empty stays undefined so optional works. */
const faNumber = z.preprocess((v) => {
  const s = toEnglishDigits(String(v ?? "")).trim();
  return s === "" ? undefined : Number(s);
}, z.number({ invalid_type_error: "عدد معتبر وارد کنید" }).positive("عدد باید بزرگ‌تر از صفر باشد"));

export const CANCELLATION_POLICIES = [
  "لغو رایگان تا ۲۴ ساعت قبل",
  "لغو رایگان تا ۴۸ ساعت قبل",
  "بیعانه غیرقابل بازگشت",
] as const;

export const addCafeSchema = z.object({
  name: z.string().trim().min(1, "نام کافه را وارد کنید"),
  phone: z.string().trim().optional(),
  address: z.string().trim().min(1, "آدرس کافه را وارد کنید"),
  tags: z.array(z.enum(TAG_VALUES)),
  parkingNote: z.string().trim().optional(),
  maxPartySize: faNumber.optional(),
  cancellationPolicy: z.enum(CANCELLATION_POLICIES),
});

export type AddCafeForm = z.infer<typeof addCafeSchema>;

/** Fields validated per wizard step, so "next" gates only the visible step. */
export const STEP_FIELDS: (keyof AddCafeForm)[][] = [
  ["name", "phone", "address"],
  ["tags", "parkingNote"],
  ["maxPartySize", "cancellationPolicy"],
  [],
];
