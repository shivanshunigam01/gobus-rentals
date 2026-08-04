import { api } from "@/lib/api";

export type CitySeoResponse = {
  city: {
    slug: string;
    name: string;
    stateName: string;
    description: string;
    popularRoutes?: { fromLabel: string; toLabel: string; href: string; notes?: string }[];
    popularIndustries?: { name: string; href?: string; blurb?: string }[];
    touristPlaces?: { name: string; blurb?: string }[];
    corporateHubs?: { name: string; blurb?: string; href?: string }[];
    metroNotes?: string;
    vehicleAvailabilitySlugs?: string[];
    pricingHints?: { notes?: string; seaterBands?: string[] };
    faqs?: { question: string; answer: string }[];
    testimonials?: { name: string; quote: string; rating?: number; company?: string }[];
    relatedServiceSlugs?: string[];
    mapEmbed?: { embedUrl?: string; label?: string };
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalPath?: string;
    robots?: string;
    ogImage?: string;
  };
  seo: Record<string, unknown>;
  internalLinks: Record<string, unknown>;
  nearbyAirports: { slug: string; name: string; canonicalPath?: string }[];
  relatedCities: { slug: string; name: string }[];
};

export async function fetchCitySeo(slug: string) {
  return api<CitySeoResponse>(`/api/public/cities/${slug}`);
}

export async function fetchProgrammaticSeo(slug: string) {
  return api<{ page: Record<string, unknown>; seo: Record<string, unknown>; internalLinks: Record<string, unknown> }>(
    `/api/public/seo-pages/${slug}`,
  );
}

export async function fetchSeoResolve(path: string) {
  return api<Record<string, unknown>>(`/api/public/seo/resolve?path=${encodeURIComponent(path)}`);
}

export async function fetchSiteSeo() {
  return api<Record<string, string>>("/api/public/seo/site");
}

export async function fetchNavLinks() {
  return api<Record<string, unknown>>("/api/public/nav-links");
}
