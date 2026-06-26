import { api } from "@/lib/apiClient";
import type { User } from "@/types";

// Mock OTP: any phone accepts this code. Real send/verify will run
// server-side later (Kavenegar) — see BUILD-PLAN.md section 7.
export const MOCK_OTP = "123456";

export async function sendOtp(phone: string): Promise<{ sent: true }> {
  // In dev we just pretend to send. The code is always MOCK_OTP.
  console.info(`[mock OTP] code for ${phone} is ${MOCK_OTP}`);
  return { sent: true };
}

export async function verifyOtp(
  phone: string,
  code: string
): Promise<User | null> {
  if (code !== MOCK_OTP) return null;
  const existing = await api.get<User[]>("/users", { phone });
  return existing[0] ?? null; // null => new user, ask for name next
}

export async function registerUser(
  phone: string,
  name: string
): Promise<User> {
  const user: User = {
    id: `u${Date.now().toString(36)}`,
    phone,
    name,
    role: "user",
    points: 0,
  };
  return api.post<User>("/users", user);
}
