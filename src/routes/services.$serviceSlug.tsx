import { createFileRoute, notFound } from "@tanstack/react-router";
import { getServiceTypePageBySlug } from "@/data/service-type-pages";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HeroSection from "@/components/service/HeroSection";
import OverviewSection from "@/components/service/OverviewSection";
import ServicesSection from "@/components/service/ServicesSection";
import BenefitsSection from "@/components/service/BenefitsSection";
import KeywordsSection from "@/components/service/KeywordsSection";
import FAQSection from "@/components/service/FAQSection";
import CTASection from "@/components/service/CTASection";

export const Route = createFileRoute("/services/$serviceSlug")({
  loader: ({ params }) => {
    const page = getServiceTypePageBySlug(params.serviceSlug);

    if (!page) throw notFound();

    return page;
  },

  component: ServicePage,
});

function ServicePage() {
  const page = Route.useLoaderData();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-5 sm:px-6 lg:px-8">
        <HeroSection
          title={page.title}
          description={page.description}
        />

        <OverviewSection
          overview={page.overview}
        />

        <ServicesSection
          services={page.services}
        />

        <BenefitsSection
          benefits={page.benefits}
        />

        <KeywordsSection
          keywords={page.keywords}
        />

        <FAQSection
          faqs={page.faqs}
        />

        <CTASection />
      </div>
      <Footer />
    </>
  );
}