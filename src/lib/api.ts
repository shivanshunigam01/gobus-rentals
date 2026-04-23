import { clearAuth, getToken } from "./auth-storage";
import { localApiRequest } from "./local-api";

/** Origin of your API (no trailing slash), e.g. http://localhost:4000 — set in `.env` as VITE_API_URL */
const raw = typeof import.meta.env.VITE_API_URL === "string" ? import.meta.env.VITE_API_URL.trim() : "";
const base = raw.replace(/\/$/, "");
const useLocalApi = import.meta.env.VITE_USE_LOCAL_API !== "false";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (
    init.body &&
    typeof init.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const t = getToken();
  const hasLegacyMockToken = typeof t === "string" && t.startsWith("mock.");
  if (hasLegacyMockToken && path.startsWith("/api/")) {
    clearAuth();
    throw new ApiError("Session expired after backend sync. Please login again.", 401);
  }
  if (t) headers.set("Authorization", `Bearer ${t}`);

  /** Authenticated app APIs should consistently use real backend. */
  const isBackendAppPath =
    path.startsWith("/api/auth") ||
    path.startsWith("/api/customer") ||
    path.startsWith("/api/vendor") ||
    path.startsWith("/api/admin") ||
    path.startsWith("/api/leads") ||
    path.startsWith("/api/payments");
  const isRemoteRequiredPath =
    path === "/api/payments/razorpay/order" ||
    path === "/api/payments/razorpay/verify" ||
    path === "/api/auth/google" ||
    isBackendAppPath;
  if (globalThis.window !== undefined && isRemoteRequiredPath && !base) {
    throw new ApiError(
      "Missing VITE_API_URL for authenticated APIs. Set it in local .env or Vercel Environment Variables.",
      500,
    );
  }
  if (globalThis.window !== undefined && isRemoteRequiredPath && base) {
    const res = await fetch(`${base}${path}`, { ...init, headers });
    const text = await res.text();
    let data: unknown = {};
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = { raw: text };
      }
    }
    if (!res.ok) {
      const msg =
        typeof data === "object" && data && "error" in data
          ? String((data as { error: string }).error)
          : res.statusText;
      if (res.status === 401) clearAuth();
      throw new ApiError(msg || "Request failed", res.status, data);
    }
    return data as T;
  }

  if (globalThis.window !== undefined && useLocalApi && path.startsWith("/api/")) {
    try {
      return (await localApiRequest(path, { ...init, headers })) as T;
    } catch (e) {
      const err = e as { status?: number; message?: string };
      throw new ApiError(err.message || "Local API failed", err.status || 500);
    }
  }

  const res = await fetch(`${base}${path}`, { ...init, headers });
  const text = await res.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const msg =
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : res.statusText;
    if (res.status === 401) clearAuth();
    throw new ApiError(msg || "Request failed", res.status, data);
  }
  return data as T;
}
