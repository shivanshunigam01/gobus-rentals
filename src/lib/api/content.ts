import { api } from "@/lib/api";
import { VEHICLE_TYPE_FALLBACK, type VehicleTypeItem } from "@/data/vehicle-types";

export type ServicePage = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: "service" | "corporate" | "industry";
  shortDescription?: string;
  description?: string;
  banner?: { url?: string; publicId?: string; alt?: string };
  gallery?: { url?: string; alt?: string }[];
  vehicleTypeSlugs?: string[];
  citySlugs?: string[];
  benefits?: string[];
  whyChooseUs?: string[];
  faqs?: { question: string; answer: string }[];
  cta?: { label?: string; href?: string };
  internalLinks?: { label: string; href: string }[];
  features?: { title: string; body: string }[];
  industries?: { name: string; body: string; href?: string }[];
  bookingProcess?: { step: number; title: string; body: string }[];
  testimonials?: { name: string; role?: string; company?: string; quote: string; rating?: number }[];
  mapEmbed?: { lat?: number; lng?: number; label?: string; embedUrl?: string };
  overview?: string;
  wordCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogImage?: string;
  robots?: string;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
  publishedAt?: string;
};

export type BlogPost = {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: { name?: string; avatarUrl?: string };
  categoryIds?: { _id: string; name: string; slug: string }[];
  tagIds?: { _id: string; name: string; slug: string }[];
  featuredImage?: { url?: string; alt?: string };
  gallery?: { url?: string; alt?: string }[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  readTimeMinutes?: number;
  status?: string;
  publishedAt?: string;
  featured?: boolean;
  related?: BlogPost[];
};

export type SiteFaq = {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  group?: string;
  sortOrder?: number;
  status?: string;
};

export type FeaturedReview = {
  id: string;
  rating: number;
  comment: string;
  customerName: string;
  vendorName?: string;
  createdAt?: string;
};

function idOf(row: { _id?: string; id?: string }) {
  return String(row.id || row._id || "");
}

export async function fetchVehicleTypes(params?: {
  category?: string;
  featured?: boolean;
}): Promise<VehicleTypeItem[]> {
  try {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.featured) q.set("featured", "true");
    const qs = q.toString();
    const res = await api<{ items: VehicleTypeItem[] }>(`/api/public/vehicle-types${qs ? `?${qs}` : ""}`);
    if (res.items?.length) return res.items;
  } catch {
    /* fallback */
  }
  let items = [...VEHICLE_TYPE_FALLBACK];
  if (params?.category) items = items.filter((v) => v.category === params.category);
  if (params?.featured) items = items.filter((v) => v.featured);
  return items;
}

export async function fetchServices(params?: {
  category?: string;
  featured?: boolean;
  city?: string;
  vehicleType?: string;
}): Promise<ServicePage[]> {
  const q = new URLSearchParams();
  if (params?.category) q.set("category", params.category);
  if (params?.featured) q.set("featured", "true");
  if (params?.city) q.set("city", params.city);
  if (params?.vehicleType) q.set("vehicleType", params.vehicleType);
  const qs = q.toString();
  const res = await api<{ items: ServicePage[] }>(`/api/public/services${qs ? `?${qs}` : ""}`);
  return res.items || [];
}

export async function fetchServiceBySlug(slug: string): Promise<ServicePage> {
  return api<ServicePage>(`/api/public/services/${slug}`);
}

export async function fetchBlogs(params?: {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
}): Promise<{ items: BlogPost[]; page: number; total: number; pages: number }> {
  const q = new URLSearchParams();
  if (params?.q) q.set("q", params.q);
  if (params?.category) q.set("category", params.category);
  if (params?.tag) q.set("tag", params.tag);
  if (params?.page) q.set("page", String(params.page));
  const qs = q.toString();
  return api(`/api/public/blogs${qs ? `?${qs}` : ""}`);
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  return api<BlogPost>(`/api/public/blogs/${slug}`);
}

export async function fetchFaqs(group?: string): Promise<SiteFaq[]> {
  const qs = group ? `?group=${encodeURIComponent(group)}` : "";
  const res = await api<{ items: SiteFaq[] }>(`/api/public/faqs${qs}`);
  return res.items || [];
}

export async function fetchFeaturedReviews(limit = 8): Promise<FeaturedReview[]> {
  const res = await api<{ items: FeaturedReview[] }>(`/api/public/reviews/featured?limit=${limit}`);
  return res.items || [];
}

export { idOf };
