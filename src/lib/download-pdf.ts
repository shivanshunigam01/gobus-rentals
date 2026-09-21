import { getToken } from "./auth-storage";

const raw = typeof import.meta.env.VITE_API_URL === "string" ? import.meta.env.VITE_API_URL.trim() : "";
const base = raw.replace(/\/$/, "");

/** Download an authenticated PDF from the API. */
export async function downloadAuthenticatedPdf(apiPath: string, filename: string) {
  const token = getToken();
  if (!base) throw new Error("Set VITE_API_URL to download PDFs from the server.");
  const res = await fetch(`${base}${apiPath}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Download failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
