const TOKEN = "lbr_token";
const USER = "lbr_user";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "vendor" | "admin" | "b2b";
  vendorId?: string;
  companyId?: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN);
}

export function setAuth(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}
