import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { fetchServices } from "@/lib/api/content";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { COMPANY } from "@/lib/company";

export const Route = createFileRoute("/industries/")({
  component: IndustriesHub,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: `Industry Transportation Solutions | ${COMPANY.platformBrand}`,
      description:
        "Dedicated transportation for IT, BPO, healthcare, factories, airports, education, mining, ports, and more.",
      path: "/industries",
      keywords: "Industry Transportation, IT Company Transport, Factory Bus Hire, Airport Transportation",
    });
    return { meta, links };
  },
});

function IndustriesHub() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["public-industries"],
    queryFn: () => fetchServices({ category: "industry" }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Industries" }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Industry Solutions</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Sector-specific mobility programs with GPS fleets, shift support, and pan-India coverage.
          </p>
          {isLoading && <p>Loading…</p>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((p) => (
              <Link
                key={p.slug}
                to="/industries/$slug"
                params={{ slug: p.slug }}
                className="border rounded-xl p-5 hover:border-primary transition-colors bg-card"
              >
                <h2 className="font-semibold mb-1">{p.title}</h2>
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
