import { fleetImages } from "@/lib/media";

/** Canonical site URL for canonical tags, OG URLs, sitemap, and JSON-LD. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://www.luxurybusrental.in";

export const SITE_NAME = "Luxury Bus Rental";

/** Matches `fleetImages.coachFrontMountain` (default OG image) for og:image width/height. */
export const DEFAULT_OG_IMAGE_WIDTH = 1600;
export const DEFAULT_OG_IMAGE_HEIGHT = 1000;

/** X (Twitter) handle for twitter:site — keep in sync with marketing profiles. */
export const SITE_TWITTER_HANDLE = "@LuxuryBusRental";

export const DEFAULT_OG_IMAGE = fleetImages.coachFrontMountain;

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
