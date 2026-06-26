import { api } from "@/lib/apiClient";
import type { Cafe, SplitBill } from "@/types";

export function getPendingCafes(): Promise<Cafe[]> {
  return api.get<Cafe[]>("/cafes", { status: "pending" });
}

export const approveCafe = (id: string) =>
  api.patch<Cafe>(`/cafes/${id}`, { status: "approved" });

export function getTransactions(): Promise<SplitBill[]> {
  return api.get<SplitBill[]>("/splitBills");
}
