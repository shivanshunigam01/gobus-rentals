import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchBlogs, fetchFaqs, fetchFeaturedReviews } from "@/lib/api/content";
import { CORPORATE_CLIENTS } from "@/data/corporate-clients";
import { Star } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export function FeaturedServicesSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-featured-services"],
    queryFn: () => fetchServices({ category: "service", featured: true }),
  });
  if (!data.length) return null;
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Featured services</h2>
            <p className="text-muted-foreground">High-demand corporate mobility offerings</p>
          </div>
          <Link to="/services" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.slice(0, 4).map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                to="/services/$serviceSlug"
                params={{ serviceSlug: p.slug }}
                className="block overflow-hidden rounded-xl border bg-card card-lift hover:border-primary"
              >
                {p.banner?.url ? (
                  <img
                    src={p.banner.url}
                    alt={p.banner.alt || p.title}
                    width={480}
                    height={240}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : null}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CorporateSolutionsSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-corporate"],
    queryFn: () => fetchServices({ category: "corporate", featured: true }),
  });
  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Corporate solutions</h2>
            <p className="text-muted-foreground">Employee commute to executive travel</p>
          </div>
          <Link to="/corporate" className="text-sm text-primary hover:underline">
            All corporate
          </Link>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice(0, 6).map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                to="/corporate/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl border p-4 bg-card card-lift hover:border-primary"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.shortDescription}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function IndustrySolutionsSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-industry"],
    queryFn: () => fetchServices({ category: "industry", featured: true }),
  });
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Industry solutions</h2>
            <p className="text-muted-foreground">Built for IT, BPO, factories, airports, and more</p>
          </div>
          <Link to="/industries" className="text-sm text-primary hover:underline">
            All industries
          </Link>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.slice(0, 8).map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                to="/industries/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl border p-4 bg-card card-lift hover:border-primary"
              >
                <h3 className="font-semibold text-sm">{p.title}</h3>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CustomerReviewsSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: () => fetchFeaturedReviews(6),
  });
  if (!data.length) return null;
  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Customer reviews</h2>
        </Reveal>
        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((r) => (
            <StaggerItem key={r.id}>
              <blockquote className="rounded-xl border p-4 bg-card card-lift">
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm mb-3">{r.comment || "Great service"}</p>
                <footer className="text-xs text-muted-foreground">{r.customerName}</footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CorporateClientsSection() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Trusted by corporate teams</h2>
        </Reveal>
        <Stagger className="flex flex-wrap justify-center gap-3">
          {CORPORATE_CLIENTS.map((c) => (
            <StaggerItem key={c}>
              <span className="inline-block rounded-full border px-4 py-2 text-sm text-muted-foreground bg-card transition-transform hover:-translate-y-0.5 hover:border-primary/40">
                {c}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function LatestBlogsSection() {
  const { data } = useQuery({
    queryKey: ["home-blogs"],
    queryFn: () => fetchBlogs({ page: 1 }),
  });
  const items = data?.items?.slice(0, 3) || [];
  if (!items.length) return null;
  return (
    <section className="py-14 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Latest blogs</h2>
          <Link to="/blog" className="text-sm text-primary hover:underline">
            View blog
          </Link>
        </Reveal>
        <Stagger className="grid sm:grid-cols-3 gap-4">
          {items.map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="block rounded-xl border p-4 bg-card card-lift hover:border-primary"
              >
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function HomeFaqsSection() {
  const { data = [] } = useQuery({
    queryKey: ["home-faqs"],
    queryFn: () => fetchFaqs("home"),
  });
  if (!data.length) return null;
  return (
    <section className="py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-center">FAQs</h2>
        </Reveal>
        <Stagger className="space-y-3">
          {data.map((f) => (
            <StaggerItem key={f.question}>
              <details className="rounded-lg border p-4 transition-colors open:border-primary/40">
                <summary className="font-medium cursor-pointer">{f.question}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
