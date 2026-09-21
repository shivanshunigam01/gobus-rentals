import { COMPANY } from "@/lib/company";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { faqPageSchema } from "@/lib/seo/schemas";
import { seoMiddleware, type ResolvedSeo } from "@/lib/seo/seoMiddleware";

/** Turn `corporate-bus-rental-delhi` into a readable title fragment. */
export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function headForProgrammaticSlug(slug: string, resolved?: ResolvedSeo | null) {
  const titleFragment = slugToTitle(slug);
  const fallback = {
    title: `${titleFragment} | Bus Rental India`,
    description: `Book ${titleFragment.toLowerCase()} with verified operators on ${COMPANY.platformBrand}. Compare quotes with transparent GST pricing from ${COMPANY.legalName}.`,
    path: `/${slug}`,
    keywords: `${slug.replace(/-/g, " ")}, bus rental India, luxury bus hire`,
  };

  const { meta, links } = seoMiddleware(resolved, fallback);
  const faqs = [
    {
      question: `How do I book ${titleFragment.toLowerCase()}?`,
      answer: `Submit your trip on ${COMPANY.platformBrand} or call ${COMPANY.contactPhoneDisplay}. Verified operators send itemised quotes; you compare and confirm with advance payment as per policy.`,
    },
    {
      question: `Is GST included for ${titleFragment.toLowerCase()}?`,
      answer: `Quotes show rental value; applicable GST is displayed at checkout on confirmed bookings managed by ${COMPANY.legalName}.`,
    },
  ];

  return {
    meta: [...meta, { "script:ld+json": faqPageSchema(faqs) }],
    links,
  };
}
