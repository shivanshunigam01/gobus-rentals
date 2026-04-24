import { createFileRoute, Link, notFound, Outlet, redirect, useChildMatches } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COMPANY } from "@/lib/company";
import { getCityBySlug, getRelatedCities, type CityRecord } from "@/data/indian-cities";
import { absoluteUrl } from "@/lib/site";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { faqPageSchema, localBusinessSchemaForCity, productBusMarketplaceSchema } from "@/lib/seo/schemas";
import { VEHICLE_CATALOG } from "@/lib/vehicle-catalog";
import { getBusTypePageBySlug, type BusTypePage } from "@/data/bus-type-pages";
import { getServiceCityPage, listServiceCitySlugs, serviceCityImageUrl } from "@/data/service-city-pages";
import { fleetImages } from "@/lib/media";
import { CheckCircle2, Users, MapPin, Star, Bus, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { BUS_TYPE_ROUTES } from "@/data/city-bus-type-routes";

const CITY_SUFFIX = "-bus-rental";
const SERVICE_CITY_SUFFIX = "-bus-rental-guide";
/** Legacy SEO URLs from older sitemaps: /bus-rental-in-{citySlug} → canonical /{citySlug}-bus-rental */
const LEGACY_BUS_RENTAL_IN_PREFIX = "bus-rental-in-";

function extractLegacyBusRentalInCitySlug(seoSlug: string) {
  if (!seoSlug.startsWith(LEGACY_BUS_RENTAL_IN_PREFIX)) return null;
  const citySlug = seoSlug.slice(LEGACY_BUS_RENTAL_IN_PREFIX.length).trim();
  if (!citySlug || !getCityBySlug(citySlug)) return null;
  return citySlug;
}

function extractCitySlug(seoSlug: string) {
  // Must end with "-bus-rental" but NOT "-bus-rental-guide"
  if (!seoSlug.endsWith(CITY_SUFFIX) || seoSlug.endsWith(SERVICE_CITY_SUFFIX)) return null;
  const citySlug = seoSlug.slice(0, seoSlug.length - CITY_SUFFIX.length).trim();
  return citySlug || null;
}

function extractServiceCitySlug(seoSlug: string) {
  if (!seoSlug.endsWith(SERVICE_CITY_SUFFIX)) return null;
  const citySlug = seoSlug.slice(0, seoSlug.length - SERVICE_CITY_SUFFIX.length).trim();
  return citySlug || null;
}

function headForCityBusRentalPage(city: CityRecord) {
  const title = `Bus Rental in ${city.name} | Luxury Bus Hire at Best Price`;
  const description = `Book luxury buses in ${city.name} with ${COMPANY.legalName}. AC, Volvo, sleeper buses at best prices. Compare quotes on ${COMPANY.platformBrand}.`;
  const path = `/${city.slug}-bus-rental`;
  const { meta, links } = buildPageMeta({
    title,
    description,
    path,
    keywords: `bus rental in ${city.name}, bus hire in ${city.name}, luxury bus rental in ${city.name}, Volvo bus ${city.name}, wedding bus rental ${city.name}, corporate bus hire ${city.name}`,
  });
  const faqs = cityPageFaqs(city.name, city.state);
  return {
    meta: [
      ...meta,
      { "script:ld+json": localBusinessSchemaForCity(city) },
      { "script:ld+json": productBusMarketplaceSchema() },
      { "script:ld+json": faqPageSchema(faqs) },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: `Bus rental ${city.name}`, item: absoluteUrl(path) },
          ],
        },
      },
    ],
    links,
  };
}

export const Route = createFileRoute("/$seoSlug")({
  beforeLoad: ({ params }) => {
    const legacyCitySlug = extractLegacyBusRentalInCitySlug(params.seoSlug);
    if (legacyCitySlug) {
      throw redirect({
        to: "/$seoSlug",
        params: { seoSlug: `${legacyCitySlug}-bus-rental` },
        replace: true,
      });
    }
    const citySlug = extractCitySlug(params.seoSlug);
    if (citySlug && getCityBySlug(citySlug)) return;
    if (getBusTypePageBySlug(params.seoSlug)) return;
    const scSlug = extractServiceCitySlug(params.seoSlug);
    if (scSlug && getServiceCityPage(scSlug)) return;
    // Plain city slug (no suffix) — powers the /:citySlug bus-type picker page
    if (getCityBySlug(params.seoSlug)) return;
    throw notFound();
  },
  head: ({ params }) => {
    const legacyCitySlug = extractLegacyBusRentalInCitySlug(params.seoSlug);
    if (legacyCitySlug) {
      const city = getCityBySlug(legacyCitySlug)!;
      return headForCityBusRentalPage(city);
    }
    const citySlug = extractCitySlug(params.seoSlug);
    const city = citySlug ? getCityBySlug(citySlug) : null;
    if (citySlug && city) {
      return headForCityBusRentalPage(city);
    }

    const busTypePage = getBusTypePageBySlug(params.seoSlug);
    if (busTypePage) {
      const path = `/${busTypePage.slug}`;
      const { meta, links } = buildPageMeta({
        title: busTypePage.title,
        description: busTypePage.description,
        path,
        keywords: busTypePage.keywords,
      });
      return {
        meta: [
          ...meta,
          { "script:ld+json": productBusMarketplaceSchema() },
          {
            "script:ld+json": faqPageSchema(
              busTypeFaqs(busTypePage).map((f) => ({ question: f.question, answer: f.answer })),
            ),
          },
          {
            "script:ld+json": {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
                { "@type": "ListItem", position: 2, name: "Bus Types For Hire", item: absoluteUrl("/bus-types-for-hire") },
                { "@type": "ListItem", position: 3, name: busTypePage.h1, item: absoluteUrl(path) },
              ],
            },
          },
        ],
        links,
      };
    }

    const scSlug = extractServiceCitySlug(params.seoSlug);
    if (scSlug) {
      const page = getServiceCityPage(scSlug);
      if (!page) throw notFound();
      const path = `/${scSlug}-bus-rental-guide`;
      const ogImagePath = `/images/service-cities/${page.imageFile}`;
      const { meta, links } = buildPageMeta({
        title: page.pageTitle,
        description: page.metaDescription,
        path,
        keywords: page.keywords,
        ogImage: absoluteUrl(ogImagePath),
        ogType: "article",
      });
      const faqs = [
        {
          question: `How do I book luxury bus rental in ${page.cityName}?`,
          answer: `Use the Book flow on ${COMPANY.platformBrand}, or call ${COMPANY.contactPhoneDisplay}. Compare quotes for Volvo, Mercedes-Benz class coaches, and tempo travellers with GST-transparent totals managed by ${COMPANY.legalName}.`,
        },
        {
          question: `Is GST shown for bus hire in ${page.cityName}?`,
          answer: `Yes. Confirmed bookings show rental value and applicable GST (${COMPANY.gstPercentage}% where enabled) before you pay, consistent with ${COMPANY.serviceBillingTagline}.`,
        },
      ];
      return {
        meta: [
          ...meta,
          { "script:ld+json": faqPageSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))) },
        ],
        links,
      };
    }

    // Plain city slug — minimal but correct meta for the picker page
    const plainCity = getCityBySlug(params.seoSlug);
    if (plainCity) {
      const { meta, links } = buildPageMeta({
        title: `Bus Rental in ${plainCity.name} — All Bus Types | ${COMPANY.legalName}`,
        description: `Compare Volvo bus, mini bus, luxury coach, tempo traveller and more in ${plainCity.name}. Get free quotes from verified operators with ${COMPANY.legalName}.`,
        path: `/${plainCity.slug}`,
        keywords: `bus rental ${plainCity.name}, volvo bus ${plainCity.name}, mini bus ${plainCity.name}, luxury bus ${plainCity.name}, tempo traveller ${plainCity.name}`,
      });
      return { meta, links };
    }

    throw notFound();
  },
  component: SeoSlugPage,
});

// ─── City page helpers ────────────────────────────────────────────────────────

function cityPageFaqs(cityName: string, state: string) {
  return [
    {
      question: `How do I book bus rental in ${cityName}?`,
      answer: `Submit your trip details on ${COMPANY.platformBrand} - pickup, drop, date, and group size. Verified operators covering ${cityName} and ${state} send quotes; you compare and confirm with advance payment as per policy.`,
    },
    {
      question: `What types of buses are available in ${cityName}?`,
      answer: `Operators list AC seater buses, luxury coaches, Volvo-class vehicles, tempo travellers for smaller groups, and sleeper buses for overnight routes subject to availability.`,
    },
    {
      question: `Is GST included for bus hire in ${cityName}?`,
      answer: `Quotes show rental value; GST is applied as per Indian law and displayed at checkout with total including GST on confirmed bookings.`,
    },
    {
      question: `Can I use ${COMPANY.platformBrand} for wedding or corporate transport in ${cityName}?`,
      answer: `Yes. Mention wedding, corporate outing, or school trip in your requirement so operators quote the right vehicle class and duration.`,
    },
  ].map((f) => ({ question: f.question, answer: f.answer }));
}

function citySeoLongForm(cityName: string, state: string) {
  return [
    `Bus rental in ${cityName} has become a strategic requirement for weddings, corporate events, school outings, pilgrimage planning, inbound tourism, and large family functions. Travelers searching for luxury bus rental in ${cityName} are no longer looking only at headline price. They compare vehicle condition, AC performance, driver quality, permit readiness, punctuality, safety standards, route planning support, and overall service experience. On ${COMPANY.platformBrand}, customers can request bus hire in ${cityName} with route details and receive comparable quotes from verified operators. This approach improves pricing clarity, helps avoid last-minute vehicle mismatch, and gives groups confidence before payment.`,
    `When customers compare bus hire in ${cityName}, one of the biggest mistakes is selecting a vehicle only by seat count. Practical planning requires understanding luggage volume, elderly passenger comfort, child-friendly boarding, pickup sequencing, and venue access. A 26 seater may be perfect for one itinerary but inefficient for another where multiple pickups are spread across ${cityName}. The better approach is to define passenger mix, reporting time, total trip duration, and expected waiting windows. This allows operators to recommend the right fleet class for bus rental in ${cityName} while keeping costs predictable and service quality consistent.`,
    `Corporate bus hire in ${cityName} typically demands strict reporting discipline, transparent billing, and professional on-ground coordination. Teams often need airport transfers, conference movement, factory visits, partner meetings, and social events within one plan. Reliable luxury bus rental in ${cityName} therefore depends on dispatch control, backup strategy, and route-aware scheduling that absorbs traffic variability in ${state}. For event planners, the most practical model is to split passengers into logical clusters and deploy mixed capacity vehicles. This protects on-time performance, improves guest experience, and reduces the operational stress that usually appears when only one large bus is planned.`,
    `Wedding bus rental in ${cityName} requires precision far beyond basic transport booking. Families need guest segmentation, venue-to-hotel loops, airport pickups, late-night returns, and standby vehicles for timing shifts. Using structured bus hire in ${cityName} helps avoid unmanaged crowding and delayed ceremonies. Customers should confirm holding time, overtime policy, driver allowance treatment, toll handling, and parking assumptions before finalizing. Premium operators for luxury bus rental in ${cityName} also provide cleaner interiors, trained chauffeurs, and better fleet presentation, which matters for destination weddings where transport quality affects the overall celebration experience.`,
    `School and college transport charters in ${cityName} need safety-first execution with route realism. Institutions booking bus rental in ${cityName} should verify compliance documents, emergency protocols, driver rest scheduling, and teacher-to-student seating allocation. Many education teams choose 30 to 52 seater AC options for excursions because these categories balance supervision visibility and travel comfort. For intercity educational tours from ${cityName}, a well-maintained coach with defined stoppage planning gives better control over attendance and return timing. This is why responsible bus hire in ${cityName} increasingly follows checklist-led procurement instead of casual quote comparison.`,
    `Pilgrimage and leisure movement from ${cityName} often spans early departures, long wait periods, and mixed-age passengers. The right luxury bus rental in ${cityName} for such use cases is one that optimizes entry convenience, cabin cooling, and ride smoothness over long durations. Groups should evaluate not only fare but also seating layout, boarding support for seniors, and route suitability for hill or highway combinations. If overnight travel is involved, compare sleeper and seater comfort by actual traveler profile, not assumptions. Strong planning in bus hire in ${cityName} reduces fatigue, improves group discipline, and minimizes mid-route operational surprises.`,
    `Price transparency is central to successful bus rental in ${cityName}. A lower base fare can still become expensive when tolls, state taxes, parking, driver batta, night charges, and waiting costs are not disclosed clearly. Customers should ask for all-in breakup and GST presentation before advance payment. On ${COMPANY.platformBrand}, quote comparison is designed for this exact clarity so buyers can evaluate total trip economics. For recurring requirements such as corporate bus hire in ${cityName}, documenting a standard commercial template creates faster approvals and cleaner reconciliation for finance teams.`,
    `Route design has a direct impact on both service quality and total cost for bus hire in ${cityName}. A single poorly planned pickup chain can increase idle time and overtime exposure. Instead, groups should assign pickup clusters, buffer intervals, and clear boarding supervisors. Operators can then dispatch the right number of 12 to 66 seater vehicles based on cluster density and road width constraints. This method is especially useful for weddings, exhibitions, and institution events in ${cityName}, where unmanaged boarding usually causes delays that ripple through the full itinerary.`,
    `Seasonality also influences luxury bus rental in ${cityName}. Wedding months, festive windows, school vacation periods, and major local events may tighten availability for premium fleet classes. Early planning helps secure preferred vehicle types and better operator selection. Customers seeking bus rental in ${cityName} should ideally lock their trip with complete details and realistic time blocks instead of vague placeholders. Precise requirements allow operators to reserve quality inventory and reduce day-of-trip substitutions. For high-priority events, asking for backup escalation options further strengthens execution reliability.`,
    `For long-distance and interstate travel from ${cityName}, compliance readiness becomes non-negotiable. Bus hire in ${cityName} should include confirmation of permits, insurance validity, and state-entry planning relevant to the route. Groups often ignore these details during quote stage and face avoidable disruptions later. A robust booking flow evaluates compliance, comfort, and commercial clarity together. This integrated approach is why marketplace-led luxury bus rental in ${cityName} is preferred by planners who need predictable outcomes rather than uncertain one-off deals.`,
    `Vehicle experience quality matters because transport is one of the first and last touchpoints in any group event. Passengers remember punctual pickup, clean seating, polite staff, and smooth drop management. Choosing premium bus rental in ${cityName} improves these outcomes and reduces complaint load for organizers. Corporate and wedding planners should align their transport standard with event quality expectations. Even when working within budget, clear specification on AC condition, seat comfort, and vehicle hygiene helps operators quote correctly and deliver consistently.`,
    `Decision-makers comparing tempo traveller vs bus for bus hire in ${cityName} should use data instead of instinct. If group size is near capacity limits, moving up one category can improve comfort and reduce luggage conflicts. If route access includes narrow streets, compact options may outperform larger buses despite similar fare. The right choice depends on passenger profile, baggage type, transfer frequency, and stop pattern. Structured planning converts these variables into reliable fleet selection and better service delivery across the entire trip lifecycle.`,
    `For procurement teams, standardizing quote evaluation improves outcomes in luxury bus rental in ${cityName}. A practical scorecard can include pricing clarity, operator verification, fleet quality, schedule confidence, safety readiness, and communication responsiveness. This model removes bias and helps teams justify vendor selection internally. It is particularly effective when multiple departments are involved in event approvals. With repeat use, the scorecard becomes a predictable framework for faster bookings and lower execution risk in bus rental across ${cityName} and surrounding hubs of ${state}.`,
    `Service quality after booking is as important as quote quality before booking. Organizers planning bus rental in ${cityName} should confirm point-of-contact details, reporting protocol, escalation hierarchy, and live coordination expectations. A pre-trip checklist shared 24 hours before movement dramatically improves execution. For large programs, route marshals and boarding coordinators can prevent confusion at pickup points. These operational controls make bus hire in ${cityName} smoother for guests and simpler for organizing teams managing multiple vehicles.`,
    `From an SEO and discovery perspective, travelers searching luxury bus rental in ${cityName} often use intent-rich terms such as bus hire in ${cityName}, wedding bus rental, corporate bus hire, AC bus booking, and group travel bus booking. High-quality city pages should answer all these intents with useful planning depth, not thin promotional content. This page is designed to support that research journey through fleet explanations, booking strategy, and practical transport insights tailored to ${cityName}.`,
    `In conclusion, successful bus rental in ${cityName}, ${state} is a mix of the right vehicle class, transparent pricing, route-aware planning, and dependable operator execution. Whether you are booking 12 seater movement for a family transfer or 66 seater capacity for large-scale programs, clarity at the planning stage determines outcome quality. By using structured bus hire in ${cityName} workflows on ${COMPANY.platformBrand}, customers can compare options fairly, reduce uncertainty, and deliver comfortable, on-time travel experiences for every passenger segment.`,
  ];
}

// ─── Bus type page helpers ────────────────────────────────────────────────────

function busTypeFaqs(page: BusTypePage) {
  return [
    {
      question: `How do I book a ${page.busType} in India?`,
      answer: `Submit your trip details on ${COMPANY.platformBrand} — pickup, drop, date, and passenger count. Select "${page.busType}" as your bus type. Verified operators send quotes that you can compare and confirm with advance payment.`,
    },
    {
      question: `What is the price of ${page.busType} rental in India?`,
      answer: `Prices vary by city, route, duration, and operator. On ${COMPANY.platformBrand} you receive itemised quotes from multiple operators so you can compare real all-in costs before committing.`,
    },
    {
      question: `Is AC available in ${page.busType} rental?`,
      answer: `Yes, most ${page.busType} options on ${COMPANY.platformBrand} are fully air-conditioned. Specify AC requirement when submitting your trip details to receive matching quotes.`,
    },
    {
      question: `Can I book a ${page.busType} for outstation travel?`,
      answer: `Absolutely. Operators cover both city contracts and long-distance outstation routes. Provide your complete route when requesting quotes so operators can include tolls, permits, and driver allowance in the estimate.`,
    },
  ];
}

// ─── Root page component ──────────────────────────────────────────────────────

function SeoSlugPage() {
  // When a child route (/:citySlug/:busTypeSlug) is active, delegate rendering to it
  const childMatches = useChildMatches();
  const { seoSlug } = Route.useParams();
  if (childMatches.length > 0) return <Outlet />;
  const citySlug = extractCitySlug(seoSlug);
  if (citySlug && getCityBySlug(citySlug)) return <CityBusRentalPage citySlug={citySlug} />;
  const busTypePage = getBusTypePageBySlug(seoSlug);
  if (busTypePage) return <BusTypeRentalPage page={busTypePage} />;
  const scSlug = extractServiceCitySlug(seoSlug);
  if (scSlug) return <ServiceCityGuidePage citySlug={scSlug} />;
  // Plain city slug → bus-type picker page
  const plainCity = getCityBySlug(seoSlug);
  if (plainCity) return <CityBusTypesPickerPage city={plainCity} />;
  throw notFound();
}

// ─── City bus-type picker page (/citySlug) ────────────────────────────────────

function CityBusTypesPickerPage({ city }: Readonly<{ city: CityRecord }>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24 md:pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Bus rental", to: "/bus-rental" },
              { label: city.name },
            ]}
          />

          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{city.state}</Badge>
              <Badge variant="outline">400+ operators</Badge>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Bus Rental in {city.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Choose your bus type below to see availability, pricing, and booking options in{" "}
              <strong className="text-foreground">{city.name}</strong>.{" "}
              Verified operators, GST-transparent quotes.
            </p>
          </div>

          {/* Quick CTA strip */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link to="/book">
              <Button size="lg" className="font-semibold gap-2">
                <Bus className="w-4 h-4" />
                Get free quotes now
              </Button>
            </Link>
            <a href={`tel:+91${COMPANY.contactPhone}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                {COMPANY.contactPhoneDisplay}
              </Button>
            </a>
            <a href={`https://wa.me/${COMPANY.whatsappE164}`} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </a>
          </div>

          {/* Bus type grid */}
          <h2 className="font-display text-xl font-semibold text-foreground mb-5">
            Available bus types in {city.name}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {BUS_TYPE_ROUTES.map((bt) => (
              <Link
                key={bt.slug}
                to="/$seoSlug/rental/$busTypeSlug"
                params={{ seoSlug: city.slug, busTypeSlug: bt.slug }}
                className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{bt.emoji}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">{bt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{bt.seats}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">{bt.tagline}</p>
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {bt.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[11px] bg-muted/60 text-muted-foreground rounded-full px-2 py-0.5"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-primary group-hover:underline">
                  {bt.label} rental in {city.name} →
                </span>
              </Link>
            ))}
          </div>

          {/* Also see full city guide */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Full bus rental guide for {city.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Detailed pricing, routes, FAQs, and operator tips for {city.state}.
              </p>
            </div>
            <Link to="/$seoSlug" params={{ seoSlug: `${city.slug}-bus-rental` }} className="shrink-0">
              <Button variant="secondary" className="gap-2">
                Read full guide
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── City landing page ────────────────────────────────────────────────────────

function CityBusRentalPage({ citySlug }: Readonly<{ citySlug: string }>) {
  const city = getCityBySlug(citySlug)!;
  const related = getRelatedCities(city, 10);
  const mapQuery = encodeURIComponent(`${city.name} ${city.state} India bus stand`);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Bus rental", to: "/bus-rental" },
              { label: city.name },
            ]}
          />
          <article>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Bus rental in {city.name} - luxury bus hire at best price
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Book <strong className="text-foreground">luxury bus rental in {city.name}</strong>, {city.state}, with{" "}
              {COMPANY.legalName}. Whether you need <strong>bus hire in {city.name}</strong> for weddings, corporate teams,
              schools, or pilgrimage groups, compare AC, Volvo, and sleeper options with transparent GST on{" "}
              {COMPANY.platformBrand}.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/book">
                <Button size="lg" className="font-semibold">Get best bus quotes now</Button>
              </Link>
              <a href={`https://wa.me/${COMPANY.whatsappE164}`} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline">WhatsApp {COMPANY.contactPhoneDisplay}</Button>
              </a>
            </div>
            <section className="mb-10 rounded-xl border border-border overflow-hidden bg-card">
              <iframe
                title={`Map of ${city.name}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=11&output=embed`}
                className="w-full h-56 sm:h-72 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </section>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-12 mb-3">Why choose us for bus rental in {city.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {COMPANY.legalName} has served travellers since 2018 with Volvo, Mercedes-Benz, seater, and sleeper buses across
              India. Our marketplace connects you with operators who know local permits, popular routes from{" "}
              {city.name}, and event-day logistics for <strong>wedding bus rental</strong> and <strong>corporate bus hire</strong>.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You get multiple quotes instead of haggling one vendor, clear <strong>group travel bus booking</strong> steps,
              and policy-backed payments. Operators compete on service and price - ideal when you are comparing{" "}
              <strong>tempo traveller vs bus</strong> configurations for the same itinerary.
            </p>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">
              All rental vehicles in {city.name}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Explore every rental product category. URL format follows{" "}
              <code className="rounded bg-muted px-1 py-0.5">/{city.slug}/rental/product</code>.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
              {BUS_TYPE_ROUTES.map((r) => (
                <Link
                  key={r.slug}
                  to="/$seoSlug/rental/$busTypeSlug"
                  params={{ seoSlug: city.slug, busTypeSlug: r.slug }}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.seats}</p>
                </Link>
              ))}
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">Available buses (AC, Volvo, sleeper)</h2>
            <div className="grid gap-3 mb-8">
              {VEHICLE_CATALOG.map((vehicle) => (
                <div key={vehicle.seats} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <h3 className="font-semibold text-foreground">
                    {vehicle.seats} - {vehicle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{vehicle.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Best for: <span className="text-foreground/90">{vehicle.bestFor}</span>
                  </p>
                </div>
              ))}
            </div>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">Popular routes from {city.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Demand patterns vary by season, but groups often book outstation charters from {city.name} to nearby business and
              leisure hubs across {city.state} and neighbouring states. Share your exact pickup and drop when requesting{" "}
              <strong>bus rental in {city.name}</strong> so operators price tolls, driver allowance, and minimum km correctly.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              For inspiration, read our guides on{" "}
              <Link to="/blog/how-to-book-bus-for-wedding-india" className="text-primary hover:underline">wedding bus booking</Link>,{" "}
              <Link to="/blog/volvo-bus-vs-sleeper-bus-india" className="text-primary hover:underline">Volvo vs sleeper buses</Link>, and{" "}
              <Link to="/bus-types-for-hire" className="text-primary hover:underline">bus types</Link>.
            </p>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">FAQs - bus hire in {city.name}</h2>
            <dl className="space-y-4">
              {cityPageFaqs(city.name, city.state).map((f) => (
                <div key={f.question} className="border-b border-border pb-4">
                  <dt className="font-medium text-foreground">{f.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{f.answer}</dd>
                </div>
              ))}
            </dl>
            <section className="mt-12 rounded-xl border border-border bg-card p-5 sm:p-7">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Complete city guide: bus rental in {city.name}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {citySeoLongForm(city.name, city.state).map((paragraph, idx) => (
                  <p key={`${city.slug}-seo-${idx}`}>{paragraph}</p>
                ))}
              </div>
            </section>
            <h2 className="font-display text-2xl font-semibold text-foreground mt-12 mb-4">More cities - bus rental India</h2>
            <p className="text-sm text-muted-foreground mb-3">Internal links help you discover <strong>bus rental</strong> coverage nearby:</p>
            <ul className="flex flex-wrap gap-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/$seoSlug"
                    params={{ seoSlug: `${c.slug}-bus-rental` }}
                    className="inline-block rounded-full border border-border bg-card px-3 py-1 text-sm text-primary hover:bg-muted transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Bus type landing page ────────────────────────────────────────────────────

function BusTypeRentalPage({ page }: Readonly<{ page: BusTypePage }>) {
  const faqs = busTypeFaqs(page);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Bus types", to: "/bus-types" },
              { label: page.h1 },
            ]}
          />
          <article>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{page.intro}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/book" search={{ busType: page.busType }}>
                <Button size="lg" className="font-semibold">Get quotes for {page.busType}</Button>
              </Link>
              <a href={`https://wa.me/${COMPANY.whatsappE164}`} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline">WhatsApp {COMPANY.contactPhoneDisplay}</Button>
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <section className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Key features</h2>
                </div>
                <ul className="space-y-2">
                  {page.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Best use cases</h2>
                </div>
                <ul className="space-y-2">
                  {page.useCases.map((u) => (
                    <li key={u} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {u}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="rounded-xl border border-border bg-card p-5 sm:p-7 mb-10">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Complete guide: {page.h1.toLowerCase()}
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {page.longForm.map((paragraph, idx) => (
                  <p key={`${page.slug}-lf-${idx}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">
              Available fleet sizes
            </h2>
            <div className="grid gap-3 mb-8">
              {VEHICLE_CATALOG.map((vehicle) => (
                <div key={vehicle.seats} className="rounded-xl border border-border bg-card p-4 sm:p-5">
                  <h3 className="font-semibold text-foreground">
                    {vehicle.seats} - {vehicle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{vehicle.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Best for: <span className="text-foreground/90">{vehicle.bestFor}</span>
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-3">
              FAQs — {page.busType} rental
            </h2>
            <dl className="space-y-4 mb-10">
              {faqs.map((f) => (
                <div key={f.question} className="border-b border-border pb-4">
                  <dt className="font-medium text-foreground">{f.question}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{f.answer}</dd>
                </div>
              ))}
            </dl>

            <h2 className="font-display text-xl font-semibold mb-3">Explore other bus types</h2>
            <p className="text-sm text-muted-foreground mb-6">
              <Link to="/bus-types-for-hire" className="text-primary hover:underline">All bus types guide</Link>
              {" · "}
              <Link to="/blog/volvo-bus-vs-sleeper-bus-india" className="text-primary hover:underline">Volvo vs sleeper bus</Link>
              {" · "}
              <Link to="/blog/how-to-book-bus-for-wedding-india" className="text-primary hover:underline">Wedding bus rental guide</Link>
            </p>

            <Link to="/book" search={{ busType: page.busType }}>
              <Button size="lg">Compare quotes for {page.busType}</Button>
            </Link>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ─── Service city guide page ──────────────────────────────────────────────────

function HeroImage({ src, alt }: Readonly<{ src: string; alt: string }>) {
  const [useFallback, setUseFallback] = useState(false);
  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-muted md:aspect-[24/9]">
      <img
        src={useFallback ? fleetImages.coachFrontMountain : src}
        alt={alt}
        width={1200}
        height={514}
        className="h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        onError={() => setUseFallback(true)}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
    </div>
  );
}

function ServiceCityGuidePage({ citySlug }: Readonly<{ citySlug: string }>) {
  const page = getServiceCityPage(citySlug)!;
  const imgUrl = serviceCityImageUrl(page.slug);
  const standardCityUrl = `/${page.slug}-bus-rental` as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-24 pt-20 md:pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Bus rental", to: "/bus-rental" },
              { label: "City guides" },
              { label: page.cityName },
            ]}
          />
          <article className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {COMPANY.legalName} · {page.state}
            </p>
            <h1 className="font-display mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">{page.h1}</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              In-depth guide and booking context for{" "}
              <strong className="text-foreground">luxury bus hire in {page.cityName}</strong> — same fleet standards as{" "}
              {COMPANY.legalName}.
            </p>

            <HeroImage src={imgUrl} alt={page.imageAlt} />
            <p className="mt-2 text-xs text-muted-foreground">
              Image:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                public/images/service-cities/{page.imageFile}
              </code>{" "}
              (replace with your photography; falls back if missing).
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/book">
                <Button size="lg" className="font-semibold">Get quotes — {page.cityName}</Button>
              </Link>
              <Link to="/$seoSlug" params={{ seoSlug: `${page.slug}-bus-rental` }}>
                <Button size="lg" variant="outline">City overview page</Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Standard city page:{" "}
              <Link
                to="/$seoSlug"
                params={{ seoSlug: `${page.slug}-bus-rental` }}
                className="text-primary underline-offset-4 hover:underline"
              >
                {standardCityUrl}
              </Link>{" "}
              — this guide adds long-form content and a branded title.
            </p>

            <div className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-headings:font-display prose-a:text-primary">
              {page.sections.map((sec) => (
                <section key={sec.id} className="mb-10">
                  <h2 className="text-2xl font-semibold text-foreground">{sec.heading}</h2>
                  {sec.paragraphs.map((p, i) => (
                    <p key={`${sec.id}-${i}`} className="text-muted-foreground leading-relaxed">{p}</p>
                  ))}
                </section>
              ))}
            </div>

            <section className="mt-14 rounded-xl border border-border bg-card p-6">
              <h2 className="font-display mb-2 text-xl font-semibold text-foreground">Other city bus rental guides</h2>
              <ul className="list-inside list-disc text-sm text-primary">
                {listServiceCitySlugs()
                  .filter((s) => s !== citySlug)
                  .map((slug) => (
                    <li key={slug}>
                      <Link
                        to="/$seoSlug"
                        params={{ seoSlug: `${slug}-bus-rental-guide` }}
                        className="hover:underline"
                      >
                        {slug}-bus-rental-guide
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
