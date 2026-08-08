import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { faqPageSchema } from "@/lib/seo/schemas";
import { Badge } from "@/components/ui/badge";
import { fleetImages } from "@/lib/media";
import { CheckSquare, Compass, FileText, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "How do I compare bus rental quotes fairly?",
    answer:
      "Align inclusions: fuel, driver, tolls, GST, minimum km, and overtime. Use Luxury Bus Rental to receive comparable quotes from multiple operators for the same itinerary.",
  },
  {
    question: "What documents should I verify before charter?",
    answer: "Check commercial vehicle permit, insurance, fitness, and driver licence class. Reputable operators share these during booking for corporate and wedding clients.",
  },
  {
    question: "When should I book for peak wedding season?",
    answer: "Aim for 8–12 weeks ahead in metros and popular destination venues. Last-minute inventory exists but limits choice of Volvo coaches and sleeper buses.",
  },
];

export const Route = createFileRoute("/bus-rental-guides")({
  component: BusRentalGuidesPage,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: "Bus Rental Guides India | Booking Tips, Checklists & Planning",
      description: `Expert bus rental guides for India: compare quotes, wedding logistics, corporate charters, GST, and safety — ${COMPANY.legalName}.`,
      path: "/bus-rental-guides",
      keywords: "bus rental guide India, bus hire tips, group travel booking, corporate charter checklist, wedding transport guide, bus rental planning India",
    });
    return {
      meta: [...meta, { "script:ld+json": faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))) }],
      links,
    };
  },
});

function BusRentalGuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Bus rental guides" }]} />
          <section className="rounded-2xl border border-border bg-card overflow-hidden mb-8">
            <img
              src={fleetImages.coachMountainRoad}
              alt="Bus rental guides for India — luxury coach travel"
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
              className="block w-full aspect-[16/9] object-cover bg-muted/30"
            />
            <div className="p-5 sm:p-7">
              <Badge variant="secondary" className="mb-3">Planning hub</Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Bus rental guides for India
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Checklists", icon: CheckSquare },
                  { label: "Route planning", icon: Compass },
                  { label: "Policy explainers", icon: FileText },
                  { label: "Safety basics", icon: ShieldCheck },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <s.icon className="w-4 h-4 text-primary mb-1" />
                    <p className="text-xs text-foreground font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <p className="text-muted-foreground leading-relaxed mb-6">
            These guides support <strong className="text-foreground">organic discovery</strong> for teams searching{" "}
            <strong>bus rental in India</strong>, <strong>luxury bus hire</strong>, and{" "}
            <strong>group travel bus booking</strong>. {COMPANY.legalName} operates {COMPANY.platformBrand} as a marketplace
            connecting customers with verified operators across {COMPANY.operatingLocations}.
          </p>

          <section className="rounded-xl border border-border bg-card p-5 sm:p-6 mb-10">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">Recommended reading order</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Start with pricing fundamentals and inclusions checklist.</li>
              <li>Pick fleet type using comfort and distance needs.</li>
              <li>Use wedding/corporate operations guides for movement plans.</li>
              <li>Finalize with policy, payment, and contingency checklist.</li>
            </ol>
          </section>

          <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Start with our long-form articles</h2>
          <ul className="list-disc pl-5 text-primary space-y-2 mb-10">
            <li>
              <Link to="/blog/bus-rental-price-delhi-2026-guide" className="hover:underline">
                Bus rental price in Delhi (2026 guide)
              </Link>
            </li>
            <li>
              <Link to="/blog/how-to-book-bus-for-wedding-india" className="hover:underline">
                How to book a bus for a wedding in India
              </Link>
            </li>
            <li>
              <Link to="/blog/volvo-bus-vs-sleeper-bus-india" className="hover:underline">
                Volvo bus vs sleeper bus — which is better?
              </Link>
            </li>
          </ul>

          <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Programmatic city pages</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Browse 400+ city landings (e.g.{" "}
            <Link to="/$seoSlug" params={{ seoSlug: "delhi-bus-rental" }} className="text-primary hover:underline">
              Delhi
            </Link>
            ,{" "}
            <Link to="/$seoSlug" params={{ seoSlug: "mumbai-bus-rental" }} className="text-primary hover:underline">
              Mumbai
            </Link>
            ) from our <Link to="/bus-rental" className="text-primary hover:underline">bus rental cities</Link> hub.
          </p>

          <h2 className="font-display text-2xl font-semibold mt-10 mb-4">FAQs</h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question} className="border-b border-border pb-4">
                <dt className="font-medium text-foreground">{f.question}</dt>
                <dd className="text-sm text-muted-foreground mt-1">{f.answer}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <Link to="/book">
              <Button size="lg">Get best bus quotes now</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
