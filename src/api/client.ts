// Single place that knows where the "API" lives.
// Today: json-server. Later: swap this baseURL for the real backend and
// nothing else in the app changes.
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Query = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(path.replace(/^\//, ""), BASE_URL + "/");
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, query?: Query) =>
    fetch(buildUrl(path, query)).then((r) => handle<T>(r)),

  post: <T>(path: string, body: unknown) =>
    fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),

  patch: <T>(path: string, body: unknown) =>
    fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r)),

  delete: <T>(path: string) =>
    fetch(buildUrl(path), { method: "DELETE" }).then((r) => handle<T>(r)),
};

/** Small id helper for client-created records against json-server. */
export const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
