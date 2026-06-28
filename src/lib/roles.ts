import type { Role } from "@/types";

/** Where a user should land after login, based on their role. */
export function homePathForRole(role?: Role): string {
  if (role === "owner") return "/owner";
  if (role === "admin") return "/admin";
  return "/app";
}
