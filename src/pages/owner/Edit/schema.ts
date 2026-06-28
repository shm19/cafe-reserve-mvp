import { z } from "zod";
import { TAG_META } from "@/lib/tags";
import type { CafeTag } from "@/types";

const TAG_VALUES = Object.keys(TAG_META) as [CafeTag, ...CafeTag[]];

export const cafeEditSchema = z.object({
  name: z.string().trim().min(1, "نام کافه را وارد کنید"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  parkingNote: z.string().trim().optional(),
  tags: z.array(z.enum(TAG_VALUES)),
});

export type CafeEditForm = z.infer<typeof cafeEditSchema>;
