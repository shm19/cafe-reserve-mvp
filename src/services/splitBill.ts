import { api, newId } from "@/lib/apiClient";
import type { Share, SplitBill } from "@/types";

/** VAT rate applied to split-bill shares when enabled. */
export const VAT_RATE = 0.09;

export function getSplitBills(): Promise<SplitBill[]> {
  return api.get<SplitBill[]>("/splitBills");
}

export function getSplitBillByBooking(
  bookingId: string
): Promise<SplitBill[]> {
  return api.get<SplitBill[]>("/splitBills", { bookingId });
}

export function getSplitBill(id: string): Promise<SplitBill> {
  return api.get<SplitBill>(`/splitBills/${id}`);
}

/**
 * Compute equal per-person shares including tax.
 * Client-side math (json-server won't do this for us).
 */
export function computeEqualShares(
  total: number,
  tax: number,
  people: string[]
): Omit<Share, "id" | "splitBillId">[] {
  const grand = total + tax;
  const per = Math.round(grand / Math.max(people.length, 1));
  return people.map((name) => ({ userOrName: name, amount: per, paid: false }));
}

export function createSplitBill(input: {
  bookingId: string;
  total: number;
  tax: number;
  createdBy: string;
  participants: { name: string; amount: number }[];
}): Promise<SplitBill> {
  const id = newId("s");
  const shares: Share[] = input.participants.map((p, i) => ({
    id: newId("sh"),
    splitBillId: id,
    userOrName: p.name,
    amount: p.amount,
    paid: i === 0, // host collects, so their own share starts settled
  }));

  const bill: SplitBill = {
    id,
    bookingId: input.bookingId,
    total: input.total,
    tax: input.tax,
    createdBy: input.createdBy,
    status: "open",
    shares,
  };
  return api.post<SplitBill>("/splitBills", bill);
}

export async function markSharePaid(
  billId: string,
  shareId: string
): Promise<SplitBill> {
  const bill = await getSplitBill(billId);
  const shares = bill.shares.map((s) =>
    s.id === shareId ? { ...s, paid: true, paymentRef: newId("pay") } : s
  );
  const status = shares.every((s) => s.paid) ? "settled" : "open";
  return api.patch<SplitBill>(`/splitBills/${billId}`, { shares, status });
}
