import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectSitemapPaths } from "./seo-public-paths.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE = (process.env.VITE_SITE_URL || "https://www.luxurybusrental.in").replace(/\/$/, "");
const API = (process.env.VITE_API_URL || process.env.SITEMAP_API_URL || "").replace(/\/$/, "");

const LASTMOD = new Date().toISOString().slice(0, 10);

const priorityFor = (path: string) => {
  if (path === "/") return { changefreq: "daily", priority: "1.0" };
  if (path === "/book") return { changefreq: "weekly", priority: "0.95" };
  if (path.startsWith("/blog/")) return { changefreq: "monthly", priority: "0.7" };
  if (path.includes("/rental/")) return { changefreq: "weekly", priority: "0.75" };
  if (path.endsWith("-bus-rental")) return { changefreq: "weekly", priority: "0.85" };
  if (path.endsWith("-bus-rental-guide")) return { changefreq: "weekly", priority: "0.85" };
  return { changefreq: "weekly", priority: "0.8" };
};

function esc(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function urlXml(path: string, changefreq = "weekly", priority = "0.8") {
  return `  <url>\n    <loc>${esc(SITE + path)}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
}

async function fetchApiPaths(): Promise<string[]> {
  if (!API) return [];
  try {
    const res = await fetch(`${API}/api/public/sitemap-urls`);
    if (!res.ok) return [];
    const data = (await res.json()) as { urls?: { path: string }[] };
    return (data.urls || []).map((u) => u.path).filter(Boolean);
  } catch {
    return [];
  }
}

const apiPaths = await fetchApiPaths();
const allPaths = collectSitemapPaths(apiPaths);

let body = "";
for (const path of allPaths) {
  const { changefreq, priority } = priorityFor(path);
  body += urlXml(path, changefreq, priority);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml, "utf8");
console.log(`[sitemap] ${SITE} — ${allPaths.length} URLs → public/sitemap.xml (api=${apiPaths.length ? "yes" : "fallback"})`);
