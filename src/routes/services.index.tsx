import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { fetchServices } from "@/lib/api/content";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/services/")({
  component: ServicesHub,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: `Transportation Services | ${COMPANY.platformBrand}`,
      description: "Featured corporate transportation services — Urbania, cabs, airport shuttles, and more.",
      path: "/services",
      keywords: "Transportation Services India, Urbania Rental, Airport Shuttle, Corporate Cab",
    });
    return { meta, links };
  },
});

function ServicesHub() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-services"],
    queryFn: () => fetchServices({ category: "service" }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Services" }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Our Services</h1>
          <p className="text-muted-foreground mb-8">
            Explore featured services or browse{" "}
            <Link to="/corporate" className="text-primary underline">
              corporate
            </Link>{" "}
            and{" "}
            <Link to="/industries" className="text-primary underline">
              industry
            </Link>{" "}
            solutions.
          </p>
          {isLoading && <p>Loading…</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            {data.map((p) => (
              <Link
                key={p.slug}
                to="/services/$serviceSlug"
                params={{ serviceSlug: p.slug }}
                className="border rounded-xl p-5 hover:border-primary transition-colors bg-card"
              >
                <h2 className="font-semibold text-lg mb-1">{p.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
