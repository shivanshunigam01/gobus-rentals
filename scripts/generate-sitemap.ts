import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { INDIAN_CITIES } from "../src/data/indian-cities.ts";
import { listServiceCitySlugs } from "../src/data/service-city-pages.ts";
import { listBusTypeSlugs } from "../src/data/bus-type-pages.ts";
import {
  BLOG_SEED_SLUGS,
  CORPORATE_SLUGS,
  INDUSTRY_SLUGS,
  SERVICE_SLUGS,
} from "../src/data/platform-slugs.ts";
import { VEHICLE_TYPE_FALLBACK } from "../src/data/vehicle-types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const SITE = (process.env.VITE_SITE_URL || "https://www.luxurybusrental.in").replace(/\/$/, "");
const API = (process.env.VITE_API_URL || process.env.SITEMAP_API_URL || "").replace(/\/$/, "");

const LASTMOD = new Date().toISOString().slice(0, 10);

const staticPaths: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/book", changefreq: "weekly", priority: "0.95" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.85" },
  { path: "/services", changefreq: "weekly", priority: "0.85" },
  { path: "/corporate", changefreq: "weekly", priority: "0.9" },
  { path: "/industries", changefreq: "weekly", priority: "0.9" },
  { path: "/bus-rental-guides", changefreq: "monthly", priority: "0.8" },
  { path: "/bus-types-for-hire", changefreq: "monthly", priority: "0.8" },
  { path: "/bus-rental", changefreq: "weekly", priority: "0.75" },
  { path: "/policies/refund-cancellation", changefreq: "yearly", priority: "0.5" },
];

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

let body = "";
const seen = new Set<string>();
const add = (path: string, changefreq?: string, priority?: string) => {
  if (seen.has(path)) return;
  seen.add(path);
  body += urlXml(path, changefreq, priority);
};

for (const x of staticPaths) add(x.path, x.changefreq, x.priority);

if (apiPaths.length) {
  for (const p of apiPaths) add(p);
} else {
  for (const slug of SERVICE_SLUGS) add(`/services/${slug}`);
  for (const slug of CORPORATE_SLUGS) add(`/corporate/${slug}`);
  for (const slug of INDUSTRY_SLUGS) add(`/industries/${slug}`);
  for (const slug of BLOG_SEED_SLUGS) add(`/blog/${slug}`, "monthly", "0.7");
  for (const v of VEHICLE_TYPE_FALLBACK) add(`/${v.slug}-rental`, "weekly", "0.7");
}

for (const c of INDIAN_CITIES) add(`/${c.slug}-bus-rental`);
for (const slug of listServiceCitySlugs()) add(`/${slug}-bus-rental-guide`, "weekly", "0.85");
for (const slug of listBusTypeSlugs()) add(`/${slug}`, "monthly", "0.8");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml, "utf8");
console.log(`[sitemap] ${SITE} — ${seen.size} URLs → public/sitemap.xml (api=${apiPaths.length ? "yes" : "fallback"})`);
