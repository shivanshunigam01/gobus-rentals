import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { faqPageSchema, productBusMarketplaceSchema } from "@/lib/seo/schemas";
import { fleetImages } from "@/lib/media";
import { VEHICLE_CATALOG } from "@/lib/vehicle-catalog";
import { Badge } from "@/components/ui/badge";
import { Bus, Snowflake, Users, RouteIcon } from "lucide-react";

const faqs = [
  {
    question: "Which bus type is best for a wedding?",
    answer: "Usually 45–52 seater AC coaches for bulk guests, plus tempo travellers for VIP shuttles. Itinerary and parking access decide the mix.",
  },
  {
    question: "Do you list non-AC buses?",
    answer: "Operators may offer non-AC for budget charters. Specify your preference when posting requirements on Luxury Bus Rental.",
  },
];

const typeGallery = [
  fleetImages.vanUrbaniaFront,
  fleetImages.vanInteriorAisle,
  fleetImages.coachDepotLine,
  fleetImages.coachSeatsReclining,
  fleetImages.coachInteriorSemiSleeper,
];

const servicePageLongForm = [
  "Bus types are the foundation of successful group transport planning in India. Travelers comparing bus rental options often search with practical intent keywords such as bus types for hire, 12 seater bus rental, 26 seater AC bus, 45 seater coach booking, 52 seater luxury bus, and 66 seater group transport. This service page is built to answer that complete journey. Instead of limiting selection to a few generic categories, we provide clear guidance from 12 seater to 66 seater options so customers can match real passenger requirements with the right vehicle class before requesting quotes.",
  "For customers researching luxury bus rental, the first decision should be mobility context: city-only movement, mixed city-highway itinerary, long-distance intercity transfer, or overnight routes. Each scenario changes the ideal bus type. A compact 12 seater or 14 seater may outperform larger buses for narrow-entry locations, while 45 to 52 seater coaches are better for centralized movement from hotels to venues. The best bus rental outcome is not achieved by maximum capacity alone; it comes from the balance of seat count, route access, comfort target, luggage profile, and reporting discipline.",
  "The 12 to 17 seater range is frequently selected for premium family mobility, wedding VIP transfers, airport movement, artist transport, and short-format business travel. These vehicles reduce boarding friction and support faster repositioning in dense areas. For planners working with multiple pickup points, smaller classes can increase punctuality because dispatch can run parallel batches. In SEO terms, this segment covers high-intent searches like tempo traveller booking, mini bus rental near me, and small group bus hire, all of which represent conversion-focused demand.",
  "The 20 to 35 seater range is usually the operational sweet spot for institutions, schools, colleges, clubs, and medium-sized corporate groups. These buses can deliver stable per-seat economics while preserving easier route maneuverability compared to full-size coaches. Event coordinators booking this class should verify AC quality, aisle layout, and expected stoppage frequency. A 26 seater may be enough for compact itineraries, while a 32 or 35 seater may perform better when guest count is variable. This segment strongly aligns with keywords such as mid-size AC bus rental and group transport bus booking.",
  "For weddings, large conventions, and destination celebrations, 40 to 52 seater buses remain the most requested categories. Organizers prefer these classes because they simplify dispatch planning and reduce the number of vehicles required. A full-size 52 seater luxury coach can move larger clusters in one cycle, which helps maintain event timelines when venues are time-sensitive. Customers searching wedding bus rental, luxury coach booking, or corporate bus hire in India generally compare this range first, making clear capacity descriptions and transparent quote terms essential for trust and conversion.",
  "The 56 to 66 seater segment is selected for very high-volume operations where fewer, bigger vehicles improve management efficiency. These classes are useful for institutional movement, pilgrimage groups, election duty movement, festival logistics, and mega event transport. However, they require route suitability checks because access roads, parking lanes, and venue gates may limit large-wheelbase operation. Good transport planning includes a pre-check of entry constraints, turning radius challenges, and waiting zones. This practical clarity protects both service quality and cost control on travel day.",
  "Another major planning area is comfort class selection. Standard AC buses serve many city and short intercity plans, but premium travelers often prefer luxury coaches with better suspension response, cleaner cabin finishes, and improved long-duration comfort. For overnight routes, sleeper configurations can be considered when berth travel is more practical than seated travel. Customers evaluating Volvo vs sleeper should map their choice to passenger profile rather than trend preference. Families with seniors may choose seater comfort and lower movement complexity, while youth groups may accept sleeper tradeoffs for overnight savings.",
  "Pricing for bus rental should always be interpreted as total trip economics rather than base fare. Operators may quote differently on fuel inclusion, toll treatment, parking, state entry taxes, driver allowance, waiting windows, and overtime slabs. A lower visible fare can become expensive if commercial assumptions are not aligned to the actual itinerary. High-quality service pages therefore include procurement guidance, not just fleet names. On Luxury Bus Rental, users can compare quote structures across categories and select based on transparent all-in understanding instead of incomplete headline numbers.",
];

export const Route = createFileRoute("/bus-types-for-hire")({
  component: BusTypesForHirePage,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: "Bus Types for Hire in India | AC, Volvo, Sleeper & Coaches",
      description: `Compare mini bus, tempo traveller, AC coach, Volvo, and sleeper buses for rental in India. All bus types for hire via ${COMPANY.platformBrand}.`,
      path: "/bus-types-for-hire",
      keywords:
        "bus types India, bus types for hire, tempo traveller vs bus, Volvo bus rental, sleeper bus hire, luxury coach rental, 45 seater bus hire",
    });
    return {
      meta: [
        ...meta,
        { "script:ld+json": productBusMarketplaceSchema() },
        { "script:ld+json": faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))) },
      ],
      links,
    };
  },
});

function BusTypesForHirePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Bus types for hire" }]} />
          <section className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
            <img
              src={fleetImages.coachFrontMountain}
              alt="Bus types for hire in India"
              className="w-full h-52 sm:h-64 object-cover bg-muted/30"
              width={1400}
              height={820}
            />
            <div className="p-5 sm:p-7">
              <Badge variant="secondary" className="mb-3">Fleet selection guide</Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Bus types for hire in India
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Choose the right vehicle for <strong className="text-foreground">bus rental</strong> outcomes.{" "}
                {COMPANY.platformBrand} helps you request quotes across categories so operators respond with fleet that matches
                your headcount, comfort needs, and route profile.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  { label: "Seat range", value: "12-66", icon: Users },
                  { label: "AC options", value: "Yes", icon: Snowflake },
                  { label: "Use cases", value: "City + Highway", icon: RouteIcon },
                  { label: "Fleet classes", value: String(VEHICLE_CATALOG.length), icon: Bus },
                ].map((k) => (
                  <div key={k.label} className="rounded-lg border border-border bg-muted/30 p-3">
                    <k.icon className="w-4 h-4 text-primary mb-1" />
                    <p className="text-[11px] text-muted-foreground">{k.label}</p>
                    <p className="text-sm font-semibold text-foreground">{k.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ul className="space-y-6">
            {VEHICLE_CATALOG.map((t, idx) => (
              <li key={t.seats} className="rounded-xl border border-border bg-card overflow-hidden">
                <img
                  src={typeGallery[idx % typeGallery.length]}
                  alt={`${t.seats} ${t.title}`}
                  className="w-full h-44 sm:h-52 object-contain bg-muted/30"
                  width={1100}
                  height={620}
                />
                <div className="p-5">
                  <h2 className="font-display text-lg font-semibold text-foreground mb-2">
                    {t.seats} - {t.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Best for: <span className="text-foreground/90">{t.bestFor}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <section className="mt-12 rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-4">
              Complete guide: bus types from 12 seater to 66 seater
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {servicePageLongForm.map((paragraph) => (
                <p key={paragraph.slice(0, 72)}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">How to pick the right bus quickly</h2>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-5">
              <li>Fix passenger count + luggage expectations first.</li>
              <li>Mark route type: city-only, mixed, or long highway.</li>
              <li>Choose comfort level: standard AC, premium coach, or sleeper.</li>
              <li>Compare quotes by inclusions (fuel, toll, GST, overtime).</li>
            </ol>
          </section>

          <h2 className="font-display text-xl font-semibold mt-12 mb-3">Related reading</h2>
          <p className="text-sm text-muted-foreground mb-6">
            <Link to="/blog/volvo-bus-vs-sleeper-bus-india" className="text-primary hover:underline">
              Volvo bus vs sleeper bus
            </Link>
            {" · "}
            <Link to="/bus-rental-guides" className="text-primary hover:underline">
              All bus rental guides
            </Link>
            {" · "}
            <Link to="/blog/how-to-book-bus-for-wedding-india" className="text-primary hover:underline">
              Wedding bus rental
            </Link>
          </p>

          <h3 className="font-semibold text-foreground mb-3">FAQs</h3>
          <dl className="space-y-4 mb-10">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="text-sm font-medium text-foreground">{f.question}</dt>
                <dd className="text-sm text-muted-foreground mt-1">{f.answer}</dd>
              </div>
            ))}
          </dl>

          <Link to="/book">
            <Button size="lg">Compare quotes for any bus type</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
