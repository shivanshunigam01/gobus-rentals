import { buildPageMeta } from "@/lib/seo/buildMeta";
import { breadcrumbSchema, faqPageSchema, serviceSchema } from "@/lib/seo/schemas";
import type { ServicePage } from "@/lib/api/content";

export function landingHead(page: ServicePage, hubLabel: string, hubPath: string) {
  const path = page.canonicalPath || `${hubPath}/${page.slug}`;
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || page.shortDescription || page.description || page.title;
  const { meta, links } = buildPageMeta({
    title,
    description,
    path,
    keywords: (page.keywords || []).join(", "),
    ogImage: page.ogImage || page.banner?.url,
    noindex: page.robots?.includes("noindex"),
  });
  return {
    meta: [
      ...meta,
      {
        "script:ld+json": serviceSchema({
          name: page.title,
          description,
          path,
          areaServed: (page.citySlugs || []).map((s) => s.replace(/-/g, " ")),
        }),
      },
      {
        "script:ld+json": faqPageSchema(page.faqs || []),
      },
      {
        "script:ld+json": breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: hubLabel, path: hubPath },
          { name: page.title, path },
        ]),
      },
    ],
    links,
  };
}
