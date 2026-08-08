import { COMPANY } from "@/lib/company";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";

const logoUrl = () => absoluteUrl("/images/logo.svg");
import type { CityRecord } from "@/data/indian-cities";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.legalName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: logoUrl(),
    description: COMPANY.about,
    email: COMPANY.contactEmail,
    telephone: `+91-${COMPANY.contactPhone}`,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: COMPANY.legalName },
  };
}

export function localBusinessSchemaForCity(city: CityRecord) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${COMPANY.legalName} — Bus rental in ${city.name}`,
    description: `Luxury and AC bus hire in ${city.name}, ${city.state}. Volvo, Mercedes-Benz, sleeper and seater buses via ${SITE_NAME}.`,
    url: absoluteUrl(`/${city.slug}-bus-rental`),
    telephone: `+91-${COMPANY.contactPhone}`,
    email: COMPANY.contactEmail,
    areaServed: {
      "@type": "City",
      name: city.name,
      containedInPlace: { "@type": "State", name: city.state },
    },
    priceRange: "$$",
  };
}

export function productBusMarketplaceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Luxury bus rental marketplace (India)",
    description: "Compare quotes for Volvo, Mercedes-Benz, AC seater and sleeper buses for weddings, corporate travel, and tours.",
    brand: { "@type": "Brand", name: COMPANY.legalName },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
  authorUrl?: string;
}) {
  const author = input.authorName
    ? {
        "@type": "Person",
        name: input.authorName,
        ...(input.authorUrl ? { url: input.authorUrl } : {}),
      }
    : { "@type": "Organization", name: COMPANY.legalName };
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author,
    publisher: {
      "@type": "Organization",
      name: COMPANY.legalName,
      url: SITE_URL,
    },
    ...(input.image ? { image: input.image } : {}),
    url: absoluteUrl(input.path),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.path),
    },
  };
}

export function reviewAggregateSchema(input: {
  name: string;
  ratingValue: number;
  reviewCount: number;
  reviews?: { author: string; reviewBody: string; ratingValue?: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue,
      reviewCount: input.reviewCount,
      bestRating: 5,
    },
    ...(input.reviews?.length
      ? {
          review: input.reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewBody: r.reviewBody,
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.ratingValue ?? 5,
              bestRating: 5,
            },
          })),
        }
      : {}),
  };
}

export function vehicleRentalSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    brand: { "@type": "Brand", name: COMPANY.legalName },
    category: "VehicleRental",
    url: absoluteUrl(input.path),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: COMPANY.legalName,
      url: SITE_URL,
    },
    areaServed: (input.areaServed || ["India"]).map((name) => ({
      "@type": "Place",
      name,
    })),
    url: absoluteUrl(input.path),
  };
}
