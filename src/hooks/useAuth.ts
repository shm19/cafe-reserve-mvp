import { useMutation, useQuery } from "@tanstack/react-query";
import { sendOtp, verifyOtp, registerUser, getUser } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

// Mutations = writes/actions (vs. useQuery for reads). Each gives us
// .mutate()/.mutateAsync(), plus .isPending / .isError / .error for free —
// that's what drives the button spinners and inline errors in the UI.

export function useSendOtp() {
  return useMutation({ mutationFn: (phone: string) => sendOtp(phone) });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (vars: { phone: string; code: string }) =>
      verifyOtp(vars.phone, vars.code),
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (vars: { phone: string; name: string }) =>
      registerUser(vars.phone, vars.name),
    onSuccess: (user) => setUser(user), // log the new user in on success
  });
}
