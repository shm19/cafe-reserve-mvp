import { api } from "@/api/client";
import { toEnglishDigits } from "@/lib/utils";
import { InvalidOtpError } from "@/lib/errors";
import type { User } from "@/types";

// Mock OTP: any phone accepts this code. Real send/verify will run
// server-side later (Kavenegar) — see BUILD-PLAN.md section 7.
export const MOCK_OTP = "1234";

// Small artificial latency so loading states are visible in dev.
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendOtp(phone: string): Promise<{ sent: true }> {
  // In dev we just pretend to send. The code is always MOCK_OTP.
  await delay(500);
  console.info(`[mock OTP] code for ${phone} is ${MOCK_OTP}`);
  return { sent: true };
}

/** Returns the existing user, or null when the code is valid but no account
 *  exists yet (caller should then collect a name). Throws InvalidOtpError on
 *  a wrong code. */
export async function verifyOtp(phone: string, code: string): Promise<User | null> {
  await delay(400);
  if (toEnglishDigits(code) !== MOCK_OTP) throw new InvalidOtpError();
  const existing = await api.get<User[]>("/users", { phone });
  return existing[0] ?? null;
}

/** Fetch the current user fresh (wallet/points/IBAN may have changed since login). */
export function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}

export const updateUser = (id: string, patch: Partial<User>) =>
  api.patch<User>(`/users/${id}`, patch);

export async function registerUser(phone: string, name: string): Promise<User> {
  await delay(400);
  const user: User = {
    id: `u${Date.now().toString(36)}`,
    phone,
    name,
    role: "user",
    points: 0,
  };
  return api.post<User>("/users", user);
}
