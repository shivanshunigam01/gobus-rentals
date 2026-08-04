import { randomUUID } from "node:crypto";

const VEHICLE_TYPES = [
  { slug: "mini-bus", name: "Mini bus", category: "bus", seatsMin: 12, seatsMax: 25, featured: true, sortOrder: 10, status: "active" },
  { slug: "tempo-traveller", name: "Tempo Traveller", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 20, status: "active" },
  { slug: "luxury-bus", name: "Luxury bus", category: "bus", seatsMin: 30, seatsMax: 45, featured: true, sortOrder: 30, status: "active" },
  { slug: "urbania", name: "Urbania", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 15, status: "active" },
  { slug: "force-urbania", name: "Force Urbania", category: "bus", seatsMin: 9, seatsMax: 17, featured: true, sortOrder: 16, status: "active" },
  { slug: "luxury-coach", name: "Luxury Coach", category: "coach", seatsMin: 40, seatsMax: 56, featured: true, sortOrder: 45, status: "active" },
  { slug: "volvo-buses", name: "Volvo buses", category: "coach", seatsMin: 35, seatsMax: 49, featured: true, sortOrder: 50, status: "active" },
  { slug: "cab", name: "Cab", category: "cab", seatsMin: 3, seatsMax: 4, featured: true, sortOrder: 200, status: "active" },
  { slug: "sedan", name: "Sedan", category: "cab", seatsMin: 3, seatsMax: 4, featured: true, sortOrder: 210, status: "active" },
  { slug: "suv", name: "SUV", category: "cab", seatsMin: 5, seatsMax: 7, featured: true, sortOrder: 220, status: "active" },
  { slug: "innova-crysta", name: "Innova Crysta", category: "cab", seatsMin: 6, seatsMax: 7, featured: true, sortOrder: 250, status: "active" },
  { slug: "employee-shuttle", name: "Employee Shuttle", category: "shuttle", seatsMin: 12, seatsMax: 40, featured: true, sortOrder: 300, status: "active" },
  { slug: "corporate-shuttle", name: "Corporate Shuttle", category: "shuttle", seatsMin: 12, seatsMax: 45, featured: true, sortOrder: 310, status: "active" },
  { slug: "airport-shuttle", name: "Airport Shuttle", category: "shuttle", seatsMin: 8, seatsMax: 40, featured: true, sortOrder: 320, status: "active" },
].map((v) => ({ ...v, _id: randomUUID(), description: `${v.name} hire across India`, imageUrl: "" }));

function page(category, title, slug, featured = false, sortOrder = 100) {
  return {
    _id: randomUUID(),
    title,
    slug,
    category,
    shortDescription: `${title} with GPS fleets and pan-India coverage.`,
    description: `${title} from Luxury Bus Rental India — employee commute, executive travel, and long-term contracts.`,
    banner: { url: "", alt: title },
    gallery: [],
    vehicleTypeSlugs: ["luxury-bus", "urbania", "employee-shuttle", "innova-crysta"],
    citySlugs: ["delhi", "mumbai", "bangalore", "hyderabad", "chennai", "pune"],
    benefits: ["GPS tracking", "Verified drivers", "Monthly contracts", "24×7 support"],
    whyChooseUs: ["Pan-India ops", "Dedicated manager", "Transparent GST invoices"],
    faqs: [
      { question: `What is included in ${title}?`, answer: "Vehicles, drivers, tracking, and account support." },
      { question: "Do you offer monthly contracts?", answer: "Yes, monthly and annual corporate contracts." },
      { question: "Which cities?", answer: "Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune and more." },
      { question: "Night shifts?", answer: "Yes, with women-safety protocols." },
      { question: "How to start?", answer: "Submit a requirement on the Book page." },
    ],
    cta: { label: "Request Corporate Quote", href: "/book" },
    internalLinks: [
      { label: "Corporate hub", href: "/corporate" },
      { label: "Industries", href: "/industries" },
    ],
    metaTitle: `${title} | Luxury Bus Rental India`,
    metaDescription: `${title} with GPS fleets and pan-India coverage.`,
    keywords: [title, "Corporate Transportation India"],
    canonicalPath: category === "corporate" ? `/corporate/${slug}` : category === "industry" ? `/industries/${slug}` : `/services/${slug}`,
    status: "published",
    featured,
    sortOrder,
    publishedAt: new Date().toISOString(),
  };
}

const CORPORATE = [
  ["Corporate Bus Rental", "corporate-bus-rental", true, 10],
  ["Corporate Bus Rental India", "corporate-bus-rental-india", true, 20],
  ["Employee Transportation Services", "employee-transportation-services", true, 30],
  ["Employee Transport Solutions", "employee-transport-solutions", false, 40],
  ["Staff Transportation Company", "staff-transportation-company", false, 50],
  ["Corporate Shuttle Services", "corporate-shuttle-services", true, 60],
  ["Corporate Fleet Services", "corporate-fleet-services", false, 70],
  ["Corporate Mobility Solutions", "corporate-mobility-solutions", false, 80],
  ["Monthly Bus Contract Services", "monthly-bus-contract-services", true, 90],
  ["Long Term Corporate Contracts", "long-term-corporate-contracts", false, 100],
  ["Long Term Bus Rental", "long-term-bus-rental", false, 110],
  ["Bus Rental for Companies", "bus-rental-for-companies", false, 120],
  ["Daily Staff Pick Drop", "daily-staff-pick-drop", true, 130],
  ["Office Staff Pickup Drop", "office-staff-pickup-drop", false, 140],
  ["Employee Shuttle Service", "employee-shuttle-service", true, 150],
  ["Intercity Corporate Travel", "intercity-corporate-travel", false, 160],
  ["Shuttle Services", "shuttle-services", false, 170],
  ["Executive Transportation", "executive-transportation", true, 180],
].map(([t, s, f, o]) => page("corporate", t, s, f, o));

const INDUSTRY = [
  "mnc-transportation", "it-company-transportation", "bpo-transportation", "government-transportation",
  "factory-transportation", "industrial-transportation", "airport-transportation", "airline-crew-transportation",
  "healthcare-transportation", "hospital-transportation", "school-bus-rental", "college-transportation",
  "university-transportation", "mining-transportation", "oil-gas-transportation", "refinery-transportation",
  "port-transportation", "warehouse-transportation", "logistics-transportation", "hotel-transportation",
  "tourist-transportation", "vip-transportation", "foreign-delegate-transportation",
].map((slug, i) => {
  const title = slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
  return page("industry", title, slug, i < 8, (i + 1) * 10);
});

const SERVICES = [
  page("service", "Corporate Transportation Platform", "corporate-transportation-platform", true, 10),
  page("service", "Urbania Rental for Corporates", "urbania-rental-for-corporates", true, 20),
  page("service", "Cab and Car Rental for Business", "cab-and-car-rental-for-business", true, 30),
  page("service", "Airport Shuttle Services", "airport-shuttle-services", true, 40),
];

const categories = [
  { _id: randomUUID(), name: "Guides", slug: "guides", status: "active" },
  { _id: randomUUID(), name: "Corporate", slug: "corporate", status: "active" },
  { _id: randomUUID(), name: "Pricing", slug: "pricing", status: "active" },
  { _id: randomUUID(), name: "Fleet", slug: "fleet", status: "active" },
];
const tags = [
  { _id: randomUUID(), name: "Bus Rental", slug: "bus-rental", status: "active" },
  { _id: randomUUID(), name: "Employee Transport", slug: "employee-transport", status: "active" },
  { _id: randomUUID(), name: "Urbania", slug: "urbania", status: "active" },
];

const blogs = [
  {
    _id: randomUUID(),
    title: "Corporate Bus Rental in India: Complete 2026 Guide",
    slug: "corporate-bus-rental-india-2026-guide",
    excerpt: "How companies choose fleet mix, contracts, and SLAs.",
    content: "Corporate bus rental in India has evolved into structured mobility programs with GPS, SLAs, and GST invoicing.",
    author: { name: "Kartar Travels Editorial" },
    categoryIds: [categories[1], categories[0]],
    tagIds: [tags[0], tags[1]],
    featuredImage: { url: "" },
    gallery: [],
    readTimeMinutes: 6,
    status: "published",
    featured: true,
    publishedAt: new Date().toISOString(),
    keywords: ["Corporate Bus Rental India"],
    related: [],
  },
  {
    _id: randomUUID(),
    title: "Force Urbania vs Tempo Traveller for Corporate Travel",
    slug: "force-urbania-vs-tempo-traveller-corporate",
    excerpt: "Compare Urbania and Tempo Traveller for teams.",
    content: "Force Urbania offers premium comfort; Tempo Travellers remain cost-effective for mid-size clusters.",
    author: { name: "Kartar Travels Editorial" },
    categoryIds: [categories[3]],
    tagIds: [tags[2]],
    featuredImage: { url: "" },
    gallery: [],
    readTimeMinutes: 4,
    status: "published",
    featured: true,
    publishedAt: new Date().toISOString(),
    keywords: ["Urbania"],
    related: [],
  },
];

const faqs = [
  { _id: randomUUID(), question: "Which vehicles are available?", answer: "Buses, Urbania, shuttles, and cabs including Innova Crysta.", group: "home", sortOrder: 10, status: "active" },
  { _id: randomUUID(), question: "Pan-India coverage?", answer: "Yes, multi-city corporate programs are supported.", group: "home", sortOrder: 20, status: "active" },
  { _id: randomUUID(), question: "Pilot routes?", answer: "Most companies start with one or two pilot routes.", group: "home", sortOrder: 30, status: "active" },
];

export const contentStore = {
  vehicleTypes: VEHICLE_TYPES,
  services: [...SERVICES, ...CORPORATE, ...INDUSTRY],
  blogCategories: categories,
  blogTags: tags,
  blogs,
  faqs,
  reviews: [
    { id: randomUUID(), rating: 5, comment: "Reliable employee shuttle for our Noida campus.", customerName: "Priya S.", vendorName: "Fleet Partner" },
    { id: randomUUID(), rating: 5, comment: "Smooth Urbania airport transfers for leadership.", customerName: "Amit K.", vendorName: "Fleet Partner" },
  ],
};

export function handleContentApi(method, path, url, body, json) {
  if (method === "GET" && path === "/api/public/vehicle-types") {
    let items = contentStore.vehicleTypes.filter((v) => v.status === "active");
    if (url.searchParams.get("featured") === "true") items = items.filter((v) => v.featured);
    if (url.searchParams.get("category")) items = items.filter((v) => v.category === url.searchParams.get("category"));
    return json(200, { items });
  }
  if (method === "GET" && path === "/api/public/services") {
    let items = contentStore.services.filter((s) => s.status === "published");
    if (url.searchParams.get("category")) items = items.filter((s) => s.category === url.searchParams.get("category"));
    if (url.searchParams.get("featured") === "true") items = items.filter((s) => s.featured);
    return json(200, { items });
  }
  if (method === "GET" && path.startsWith("/api/public/services/")) {
    const slug = path.split("/").pop();
    const row = contentStore.services.find((s) => s.slug === slug && s.status === "published");
    if (!row) return json(404, { error: "Not found" });
    return json(200, row);
  }
  if (method === "GET" && path === "/api/public/blogs") {
    let items = contentStore.blogs.filter((b) => b.status === "published");
    const q = url.searchParams.get("q");
    if (q) items = items.filter((b) => `${b.title} ${b.excerpt}`.toLowerCase().includes(q.toLowerCase()));
    return json(200, { items, page: 1, total: items.length, pages: 1 });
  }
  if (method === "GET" && path.startsWith("/api/public/blogs/")) {
    const slug = path.split("/").pop();
    const row = contentStore.blogs.find((b) => b.slug === slug);
    if (!row) return json(404, { error: "Not found" });
    return json(200, { ...row, related: contentStore.blogs.filter((b) => b.slug !== slug).slice(0, 2) });
  }
  if (method === "GET" && path === "/api/public/blog-categories") return json(200, { items: contentStore.blogCategories });
  if (method === "GET" && path === "/api/public/blog-tags") return json(200, { items: contentStore.blogTags });
  if (method === "GET" && path === "/api/public/faqs") {
    let items = contentStore.faqs.filter((f) => f.status === "active");
    if (url.searchParams.get("group")) items = items.filter((f) => f.group === url.searchParams.get("group"));
    return json(200, { items });
  }
  if (method === "GET" && path === "/api/public/reviews/featured") return json(200, { items: contentStore.reviews });
  if (method === "GET" && path === "/api/public/fleet") return json(200, { items: [] });
  if (method === "GET" && path === "/api/public/sitemap-urls") {
    const urls = [
      { path: "/" },
      { path: "/corporate" },
      { path: "/industries" },
      { path: "/services" },
      { path: "/blog" },
      ...contentStore.services.map((s) => ({ path: s.canonicalPath })),
      ...contentStore.blogs.map((b) => ({ path: `/blog/${b.slug}` })),
      ...contentStore.vehicleTypes.map((v) => ({ path: `/${v.slug}-rental` })),
    ];
    return json(200, { urls });
  }

  // Admin content
  if (method === "GET" && path === "/api/admin/vehicle-types") return json(200, { items: contentStore.vehicleTypes });
  if (method === "POST" && path === "/api/admin/vehicle-types") {
    const row = { _id: randomUUID(), status: "active", ...body, slug: body.slug || String(body.name || "").toLowerCase().replace(/\s+/g, "-") };
    contentStore.vehicleTypes.push(row);
    return json(201, row);
  }
  if (method === "GET" && path === "/api/admin/services") return json(200, { items: contentStore.services });
  if (method === "POST" && path === "/api/admin/services") {
    const row = { _id: randomUUID(), status: "draft", ...body, slug: body.slug || String(body.title || "").toLowerCase().replace(/\s+/g, "-") };
    contentStore.services.push(row);
    return json(201, row);
  }
  if (method === "GET" && path === "/api/admin/blogs") return json(200, { items: contentStore.blogs });
  if (method === "POST" && path === "/api/admin/blogs") {
    const row = { _id: randomUUID(), status: "draft", readTimeMinutes: 5, ...body };
    contentStore.blogs.push(row);
    return json(201, row);
  }
  if (method === "GET" && path === "/api/admin/blog-categories") return json(200, { items: contentStore.blogCategories });
  if (method === "POST" && path === "/api/admin/blog-categories") {
    const row = { _id: randomUUID(), status: "active", ...body };
    contentStore.blogCategories.push(row);
    return json(201, row);
  }
  if (method === "GET" && path === "/api/admin/blog-tags") return json(200, { items: contentStore.blogTags });
  if (method === "POST" && path === "/api/admin/blog-tags") {
    const row = { _id: randomUUID(), status: "active", ...body };
    contentStore.blogTags.push(row);
    return json(201, row);
  }
  if (method === "GET" && path === "/api/admin/faqs") return json(200, { items: contentStore.faqs });
  if (method === "POST" && path === "/api/admin/faqs") {
    const row = { _id: randomUUID(), status: "active", ...body };
    contentStore.faqs.push(row);
    return json(201, row);
  }

  const patchMatch = path.match(/^\/api\/admin\/(vehicle-types|services|blogs|blog-categories|blog-tags|faqs)\/([^/]+)$/);
  if (patchMatch && (method === "PATCH" || method === "DELETE")) {
    const keyMap = {
      "vehicle-types": "vehicleTypes",
      services: "services",
      blogs: "blogs",
      "blog-categories": "blogCategories",
      "blog-tags": "blogTags",
      faqs: "faqs",
    };
    const arr = contentStore[keyMap[patchMatch[1]]];
    const idx = arr.findIndex((r) => String(r._id) === patchMatch[2] || String(r.id) === patchMatch[2]);
    if (idx < 0) return json(404, { error: "Not found" });
    if (method === "DELETE") {
      arr.splice(idx, 1);
      return json(200, { ok: true });
    }
    arr[idx] = { ...arr[idx], ...body };
    return json(200, arr[idx]);
  }

  return null;
}
