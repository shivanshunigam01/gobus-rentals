/**
 * Shared list of public indexable URL paths for sitemap generation and static prerender.
 */
import { INDIAN_CITIES } from "../src/data/indian-cities.ts";
import { listBusTypeSlugs } from "../src/data/bus-type-pages.ts";
import { BUS_TYPE_ROUTES } from "../src/data/city-bus-type-routes.ts";
import {
  BLOG_SEED_SLUGS,
  CORPORATE_SLUGS,
  INDUSTRY_SLUGS,
  SERVICE_CITY_SLUGS,
  SERVICE_SLUGS,
  VEHICLE_RENTAL_SLUGS,
} from "../src/data/platform-slugs.ts";

const STATIC_PATHS = [
  "/",
  "/book",
  "/about",
  "/contact",
  "/blog",
  "/services",
  "/corporate",
  "/industries",
  "/bus-rental-guides",
  "/bus-types-for-hire",
  "/bus-rental",
  "/policies/refund-cancellation",
  "/sitemap",
] as const;

export type PublicPathOptions = {
  /** Include /:city/rental/:busType URLs (large — sitemap only by default). */
  includeCityRentals?: boolean;
  /** Extra paths from API (programmatic SEO pages). */
  apiPaths?: string[];
};

export function collectPublicPaths(options: PublicPathOptions = {}): string[] {
  const { includeCityRentals = false, apiPaths = [] } = options;
  const seen = new Set<string>();

  const add = (path: string) => {
    if (!path || path.includes("?") || path.includes("#")) return;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (
      normalized.startsWith("/admin") ||
      normalized.startsWith("/vendor") ||
      normalized.startsWith("/customer") ||
      normalized.startsWith("/b2b") ||
      normalized.startsWith("/login") ||
      normalized.startsWith("/signup")
    ) {
      return;
    }
    seen.add(normalized);
  };

  for (const p of STATIC_PATHS) add(p);

  if (apiPaths.length) {
    for (const p of apiPaths) add(p);
  } else {
    for (const slug of SERVICE_SLUGS) add(`/services/${slug}`);
    for (const slug of CORPORATE_SLUGS) add(`/corporate/${slug}`);
    for (const slug of INDUSTRY_SLUGS) add(`/industries/${slug}`);
    for (const slug of BLOG_SEED_SLUGS) add(`/blog/${slug}`);
    for (const slug of VEHICLE_RENTAL_SLUGS) add(`/${slug}-rental`);
  }

  for (const c of INDIAN_CITIES) {
    add(`/${c.slug}-bus-rental`);
    add(`/${c.slug}`);
    if (includeCityRentals) {
      for (const bt of BUS_TYPE_ROUTES) add(`/${c.slug}/rental/${bt.slug}`);
    }
  }

  for (const slug of SERVICE_CITY_SLUGS) add(`/${slug}-bus-rental-guide`);
  for (const slug of listBusTypeSlugs()) add(`/${slug}`);

  return [...seen];
}

/** Paths to prerender at build time (keeps Vercel builds fast). */
export function collectPrerenderPaths(apiPaths: string[] = []): string[] {
  return collectPublicPaths({ includeCityRentals: false, apiPaths });
}

/** Full sitemap URL list including city × bus-type rental pages. */
export function collectSitemapPaths(apiPaths: string[] = []): string[] {
  return collectPublicPaths({ includeCityRentals: true, apiPaths });
}
