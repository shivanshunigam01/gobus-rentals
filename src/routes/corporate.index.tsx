import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { fetchServices } from "@/lib/api/content";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/corporate/")({
  component: CorporateHub,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: `Corporate Transport Solutions | ${COMPANY.platformBrand}`,
      description:
        "Corporate bus rental, employee transportation, shuttle services, and long-term contracts across India.",
      path: "/corporate",
      keywords: "Corporate Bus Rental, Employee Transportation, Corporate Shuttle India",
    });
    return { meta, links };
  },
});

function CorporateHub() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-corporate"],
    queryFn: () => fetchServices({ category: "corporate" }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Corporate" }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Corporate Transport Solutions</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Employee commute, executive travel, shuttles, and long-term fleet contracts for companies across India.
          </p>
          {isLoading && <p>Loading…</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            {data.map((p) => (
              <Link
                key={p.slug}
                to="/corporate/$slug"
                params={{ slug: p.slug }}
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
