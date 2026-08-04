import { buildPageMeta } from "@/lib/seo/buildMeta";

export type ResolvedSeo = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[] | string;
  canonicalPath?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  path?: string;
};

/** Merge API-resolved SEO into TanStack head() meta/links. Prefer admin/entity data over hardcoding. */
export function seoMiddleware(
  resolved: ResolvedSeo | null | undefined,
  fallback: { title: string; description: string; path: string; keywords?: string; ogImage?: string; noindex?: boolean },
) {
  const path = resolved?.canonicalPath || resolved?.path || fallback.path;
  const title = resolved?.metaTitle || fallback.title;
  const description = resolved?.metaDescription || fallback.description;
  const keywords = Array.isArray(resolved?.keywords)
    ? resolved!.keywords!.join(", ")
    : resolved?.keywords || fallback.keywords;
  const noindex =
    fallback.noindex ||
    String(resolved?.robots || "").includes("noindex");

  const { meta, links } = buildPageMeta({
    title,
    description,
    path,
    keywords,
    ogImage: resolved?.ogImage || fallback.ogImage,
    noindex,
  });

  if (!noindex && resolved?.robots) {
    meta.push({ name: "robots", content: resolved.robots });
  } else if (!noindex) {
    meta.push({ name: "robots", content: "index, follow" });
  }

  return { meta, links, path, title, description };
}
