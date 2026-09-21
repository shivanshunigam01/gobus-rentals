import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_IMAGE_HEIGHT,
  SITE_TWITTER_HANDLE,
  absoluteUrl,
} from "@/lib/site";

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogImage?: string;
  /** When `ogImage` is custom, set dimensions so OG tags stay accurate. Defaults match `DEFAULT_OG_IMAGE`. */
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
};

/**
 * TanStack Router head() meta + links (canonical, hrefLang, OG, Twitter).
 * See: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export function buildPageMeta(input: PageMetaInput) {
  const url = absoluteUrl(input.path);
  const ogImage = input.ogImage || DEFAULT_OG_IMAGE;
  const usingDefaultOg = !input.ogImage || input.ogImage === DEFAULT_OG_IMAGE;
  const ogW = input.ogImageWidth ?? (usingDefaultOg ? DEFAULT_OG_IMAGE_WIDTH : undefined);
  const ogH = input.ogImageHeight ?? (usingDefaultOg ? DEFAULT_OG_IMAGE_HEIGHT : undefined);
  const ogAlt = input.ogImageAlt ?? `${SITE_NAME} — luxury bus and coach rental in India`;
  const title = String(input.title || SITE_NAME);
  const description = String(input.description || title);
  const titleFull = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  const meta: Array<Record<string, string> | { title: string }> = [
    { title: titleFull },
    { name: "description", content: description },
    ...(input.keywords ? [{ name: "keywords", content: input.keywords }] : []),
    ...(input.noindex
      ? [{ name: "robots", content: "noindex, nofollow" }]
      : [{ name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }]),
    { property: "og:title", content: titleFull },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: input.ogType || "website" },
    { property: "og:image", content: ogImage },
    ...(ogW != null ? [{ property: "og:image:width", content: String(ogW) }] : []),
    ...(ogH != null ? [{ property: "og:image:height", content: String(ogH) }] : []),
    { property: "og:image:alt", content: ogAlt },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE_TWITTER_HANDLE },
    { name: "twitter:title", content: titleFull },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
  ];

  const links: Array<{ rel: string; href: string; hrefLang?: string }> = [
    { rel: "canonical", href: url },
    { rel: "alternate", hrefLang: "en-IN", href: url },
    { rel: "alternate", hrefLang: "x-default", href: url },
  ];

  return { meta, links };
}
