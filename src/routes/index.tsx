import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HomeGallerySection } from "@/components/HomeGallerySection";
import { StatsSection } from "@/components/StatsSection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTASection } from "@/components/CTASection";
import { FleetSliderSection } from "@/components/home/FleetSliderSection";
import { UrbaniaSection, CabSection } from "@/components/home/UrbaniaCabSections";
import {
  FeaturedServicesSection,
  CorporateSolutionsSection,
  IndustrySolutionsSection,
  CustomerReviewsSection,
  CorporateClientsSection,
  LatestBlogsSection,
  HomeFaqsSection,
} from "@/components/home/SolutionsSections";
import { OffersSection } from "@/components/home/OffersSection";
import { COMPANY } from "@/lib/company";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { faqPageSchema } from "@/lib/seo/schemas";

const HomeSeoContentSection = lazy(() =>
  import("@/components/HomeSeoContentSection").then((m) => ({ default: m.HomeSeoContentSection })),
);

const homeFaqs = [
  {
    question: "How does Luxury Bus Rental work?",
    answer: `Submit your trip on ${COMPANY.platformBrand}; verified operators send quotes. Compare bus hire options, pay per policy, and travel with ${COMPANY.legalName}'s marketplace standards.`,
  },
  {
    question: "Do you cover all India for bus rental?",
    answer:
      "Yes. We serve 400+ cities across all of India — North, South, East, and West. Submit your trip details and verified operators in your region will respond with quotes.",
  },
  {
    question: "Which vehicles can companies book?",
    answer:
      "Luxury buses, mini buses, Tempo Traveller, Urbania, Force Urbania, luxury coaches, employee/corporate/airport shuttles, and cabs including sedan, SUV, MUV, hatchback, and Innova Crysta.",
  },
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: "Corporate Transportation & Luxury Bus Rental India",
      description:
        "India’s corporate transportation platform — employee shuttles, Urbania, luxury buses, and cabs. Pan-India coverage, GST quotes, verified operators.",
      path: "/",
      keywords:
        "corporate transportation India, employee transportation, luxury bus rental, Urbania rental, corporate shuttle, Innova Crysta hire, tempo traveller on rent, bus rental in India",
    });
    return {
      meta: [
        ...meta,
        {
          "script:ld+json": faqPageSchema(homeFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
        },
      ],
      links,
    };
  },
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HomeGallerySection />
        <StatsSection />
        <FleetSliderSection />
        <UrbaniaSection />
        <CabSection />
        <FeaturedServicesSection />
        <OffersSection />
        <CorporateSolutionsSection />
        <IndustrySolutionsSection />
        <CustomerReviewsSection />
        <CorporateClientsSection />
        <LatestBlogsSection />
        <HomeFaqsSection />
        <Suspense fallback={null}>
          <HomeSeoContentSection />
        </Suspense>
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
