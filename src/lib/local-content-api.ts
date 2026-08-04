import { VEHICLE_TYPE_FALLBACK } from "@/data/vehicle-types";
import {
  BLOG_SEED_SLUGS,
  CORPORATE_SLUGS,
  INDUSTRY_SLUGS,
  SERVICE_SLUGS,
} from "@/data/platform-slugs";

function mkPage(category: "service" | "corporate" | "industry", title: string, slug: string, featured = false) {
  return {
    _id: `local-${slug}`,
    title,
    slug,
    category,
    shortDescription: `${title} with GPS fleets and pan-India coverage.`,
    description: `${title} from Luxury Bus Rental India.`,
    banner: { url: "", alt: title },
    gallery: [],
    vehicleTypeSlugs: ["luxury-bus", "urbania", "employee-shuttle", "innova-crysta"],
    citySlugs: ["delhi", "mumbai", "bangalore", "hyderabad"],
    benefits: ["GPS tracking", "Verified drivers", "Monthly contracts", "24×7 support"],
    whyChooseUs: ["Pan-India ops", "Dedicated manager", "Transparent GST invoices"],
    faqs: [
      { question: `What is included in ${title}?`, answer: "Vehicles, drivers, tracking, and account support." },
      { question: "Monthly contracts?", answer: "Yes." },
      { question: "Cities?", answer: "Major metros across India." },
      { question: "Night shifts?", answer: "Supported with safety protocols." },
      { question: "How to start?", answer: "Book a quote online." },
    ],
    cta: { label: "Request Corporate Quote", href: "/book" },
    internalLinks: [
      { label: "Corporate", href: "/corporate" },
      { label: "Industries", href: "/industries" },
    ],
    metaTitle: `${title} | Luxury Bus Rental India`,
    metaDescription: `${title} with GPS fleets and pan-India coverage.`,
    keywords: [title],
    canonicalPath:
      category === "corporate" ? `/corporate/${slug}` : category === "industry" ? `/industries/${slug}` : `/services/${slug}`,
    status: "published",
    featured,
    sortOrder: 100,
    publishedAt: new Date().toISOString(),
  };
}

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const services = [
  ...SERVICE_SLUGS.map((s, i) => mkPage("service", titleFromSlug(s), s, i < 4)),
  ...CORPORATE_SLUGS.map((s, i) => mkPage("corporate", titleFromSlug(s), s, i < 6)),
  ...INDUSTRY_SLUGS.map((s, i) => mkPage("industry", titleFromSlug(s), s, i < 8)),
];

const blogs = BLOG_SEED_SLUGS.map((slug, i) => ({
  _id: `blog-${slug}`,
  title: titleFromSlug(slug),
  slug,
  excerpt: `Guide: ${titleFromSlug(slug)}`,
  content: `${titleFromSlug(slug)}\n\nPractical corporate transportation guidance from Luxury Bus Rental India.`,
  author: { name: "Kartar Travels Editorial" },
  categoryIds: [{ _id: "cat-guides", name: "Guides", slug: "guides" }],
  tagIds: [{ _id: "tag-bus", name: "Bus Rental", slug: "bus-rental" }],
  featuredImage: { url: "" },
  gallery: [],
  readTimeMinutes: 5,
  status: "published",
  featured: i < 3,
  publishedAt: new Date().toISOString(),
  keywords: ["Corporate Transport"],
}));

const faqs = [
  {
    _id: "faq1",
    question: "Which vehicles are available for corporate transportation?",
    answer: "Luxury buses, Urbania, shuttles, and cabs including Innova Crysta.",
    group: "home",
    status: "active",
  },
  {
    _id: "faq2",
    question: "Do you provide pan-India corporate bus rental?",
    answer: "Yes, multi-city programs are supported.",
    group: "home",
    status: "active",
  },
];

export function handleLocalContentApi(path: string, method: string, searchParams: URLSearchParams): unknown | null {
  if (!path.startsWith("/api/public/") && !path.startsWith("/api/admin/vehicle-types") && !path.startsWith("/api/admin/services") && !path.startsWith("/api/admin/blogs") && !path.startsWith("/api/admin/faqs") && !path.startsWith("/api/admin/blog-")) {
    return null;
  }

  if (method === "GET" && path === "/api/public/vehicle-types") {
    let items = [...VEHICLE_TYPE_FALLBACK];
    if (searchParams.get("featured") === "true") items = items.filter((v) => v.featured);
    if (searchParams.get("category")) items = items.filter((v) => v.category === searchParams.get("category"));
    return { items };
  }
  if (method === "GET" && path === "/api/public/services") {
    let items = services.filter((s) => s.status === "published");
    if (searchParams.get("category")) items = items.filter((s) => s.category === searchParams.get("category"));
    if (searchParams.get("featured") === "true") items = items.filter((s) => s.featured);
    return { items };
  }
  if (method === "GET" && path.startsWith("/api/public/services/")) {
    const slug = path.split("/").pop()!;
    const row = services.find((s) => s.slug === slug);
    if (!row) throw Object.assign(new Error("Not found"), { status: 404 });
    return row;
  }
  if (method === "GET" && path === "/api/public/blogs") {
    return { items: blogs, page: 1, total: blogs.length, pages: 1 };
  }
  if (method === "GET" && path.startsWith("/api/public/blogs/")) {
    const slug = path.split("/").pop()!;
    const row = blogs.find((b) => b.slug === slug);
    if (!row) throw Object.assign(new Error("Not found"), { status: 404 });
    return { ...row, related: blogs.filter((b) => b.slug !== slug).slice(0, 2) };
  }
  if (method === "GET" && path === "/api/public/blog-categories") {
    return { items: [{ _id: "cat-guides", name: "Guides", slug: "guides", status: "active" }] };
  }
  if (method === "GET" && path === "/api/public/blog-tags") {
    return { items: [{ _id: "tag-bus", name: "Bus Rental", slug: "bus-rental", status: "active" }] };
  }
  if (method === "GET" && path === "/api/public/faqs") {
    let items = faqs;
    if (searchParams.get("group")) items = items.filter((f) => f.group === searchParams.get("group"));
    return { items };
  }
  if (method === "GET" && path === "/api/public/reviews/featured") {
    return {
      items: [
        { id: "r1", rating: 5, comment: "Reliable corporate shuttle.", customerName: "Priya S." },
      ],
    };
  }
  if (method === "GET" && path === "/api/public/sitemap-urls") {
    return {
      urls: [
        ...services.map((s) => ({ path: s.canonicalPath })),
        ...blogs.map((b) => ({ path: `/blog/${b.slug}` })),
        { path: "/delhi-bus-rental" },
        { path: "/mumbai-bus-rental" },
        { path: "/corporate-bus-rental-delhi" },
      ],
    };
  }
  if (method === "GET" && path === "/api/public/seo/site") {
    return {
      canonicalHost: "https://www.luxurybusrental.in",
      siteName: "Luxury Bus Rental",
      defaultMetaTitle: "Luxury Bus Rental India",
      defaultMetaDescription: "Corporate bus rental and luxury coaches across India.",
      defaultRobots: "index,follow",
    };
  }
  if (method === "GET" && path.startsWith("/api/public/seo/resolve")) {
    return {
      path: searchParams.get("path") || "/",
      metaTitle: "Luxury Bus Rental India",
      metaDescription: "Book luxury bus rental across India.",
      robots: "index,follow",
      canonicalPath: searchParams.get("path") || "/",
    };
  }
  if (method === "GET" && path.startsWith("/api/public/cities/")) {
    const slug = path.split("/").pop()!;
    const name = titleFromSlug(slug);
    return {
      city: {
        slug,
        name,
        stateName: "India",
        description: `${name} bus rental marketplace overview with corporate and tourist demand.`,
        popularRoutes: [{ fromLabel: name, toLabel: "Airport", href: "/book", notes: "Airport transfer" }],
        popularIndustries: [{ name: "IT", href: "/industries", blurb: "Campus shuttles" }],
        touristPlaces: [{ name: `${name} centre`, blurb: "Popular pickup" }],
        corporateHubs: [{ name: `${name} business park`, blurb: "Employee transport", href: "/corporate" }],
        metroNotes: `${name} road and metro connectivity for fleet pickups.`,
        vehicleAvailabilitySlugs: ["luxury-bus", "urbania", "tempo-traveller"],
        pricingHints: { notes: "Indicative estimates only.", seaterBands: ["12–20 seater", "35–45 seater"] },
        faqs: [
          { question: `How to book in ${name}?`, answer: "Submit a quote online." },
          { question: "Corporate contracts?", answer: "Yes." },
        ],
        relatedServiceSlugs: ["corporate-bus-rental", "employee-transportation"],
        canonicalPath: `/${slug}-bus-rental`,
        mapEmbed: { embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(name)}&output=embed`, label: name },
      },
      seo: {},
      internalLinks: {
        relatedCities: [{ href: "/mumbai-bus-rental", anchor: "Bus rental in Mumbai" }],
        relatedVehicles: [{ href: "/urbania-rental", anchor: "Urbania rental" }],
        relatedServices: [{ href: "/corporate/corporate-bus-rental", anchor: "Corporate Bus Rental" }],
        trendingCities: [{ href: "/delhi-bus-rental", anchor: "Bus rental in Delhi" }],
        popularSearches: [{ href: "/book", anchor: "Book luxury bus online" }],
      },
      nearbyAirports: [],
      relatedCities: [{ slug: "mumbai", name: "Mumbai" }],
    };
  }
  if (method === "GET" && path.startsWith("/api/public/seo-pages/")) {
    const slug = path.split("/").pop()!;
    return {
      page: {
        slug,
        h1: titleFromSlug(slug),
        title: titleFromSlug(slug),
        body: `${titleFromSlug(slug)} with verified vendors on Luxury Bus Rental India.`,
        faqs: [{ question: "How to book?", answer: "Use the booking form." }],
        canonicalPath: `/${slug}`,
      },
      seo: {},
      internalLinks: {
        relatedCities: [{ href: "/delhi-bus-rental", anchor: "Bus rental in Delhi" }],
        relatedServices: [{ href: "/corporate", anchor: "Corporate transport" }],
      },
    };
  }
  if (method === "GET" && path === "/api/public/nav-links") {
    return {
      headerLinks: [{ href: "/corporate", anchor: "Corporate" }],
      footerLinks: [{ href: "/sitemap", anchor: "Sitemap" }],
      trendingCities: [{ href: "/delhi-bus-rental", anchor: "Delhi" }],
      popularSearches: [{ href: "/book", anchor: "Book now" }],
      latestBlogs: [],
      mostBookedVehicles: [{ href: "/urbania-rental", anchor: "Urbania" }],
    };
  }
  if (method === "GET" && path === "/api/admin/vehicle-types") return { items: VEHICLE_TYPE_FALLBACK };
  if (method === "GET" && path === "/api/admin/services") return { items: services };
  if (method === "GET" && path === "/api/admin/blogs") return { items: blogs };
  if (method === "GET" && path === "/api/admin/faqs") return { items: faqs };
  if (method === "GET" && path === "/api/admin/blog-categories") {
    return { items: [{ _id: "cat-guides", name: "Guides", slug: "guides", status: "active" }] };
  }
  if (method === "GET" && path === "/api/admin/blog-tags") {
    return { items: [{ _id: "tag-bus", name: "Bus Rental", slug: "bus-rental", status: "active" }] };
  }

  return { items: [] };
}
