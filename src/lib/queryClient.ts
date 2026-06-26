import { QueryClient } from "@tanstack/react-query";

// One shared client for the whole app. Defaults tuned for a mock API:
// - staleTime: treat data as fresh for 30s (fewer refetches while clicking around)
// - retry: 1 try only (a down json-server should fail fast, not hammer)
// - refetchOnWindowFocus off (annoying in dev)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
