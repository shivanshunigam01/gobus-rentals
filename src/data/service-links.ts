import { SERVICE_TYPE_PAGES } from "@/data/service-type-pages";

/**
 * Navbar → "Bus types +" menu.
 * Each entry links to its dedicated SEO landing page (e.g. /mini-bus-rental).
 */
export type NavbarServiceTypeLink = Readonly<{
  label: string;
  to: string;
}>;

export const NAVBAR_SERVICE_TYPE_LINKS: readonly NavbarServiceTypeLink[] = SERVICE_TYPE_PAGES.map((page) => ({
  label: `${page.title}`,
  to: `/services/${page.slug}`,
}));
