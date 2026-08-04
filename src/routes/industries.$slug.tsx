import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceLandingView } from "@/components/landing/ServiceLandingView";
import { fetchServiceBySlug, type ServicePage } from "@/lib/api/content";
import { landingHead } from "@/lib/landingHead";

export const Route = createFileRoute("/industries/$slug")({
  loader: async ({ params }) => {
    try {
      const page = await fetchServiceBySlug(params.slug);
      if (page.category !== "industry") throw notFound();
      return page;
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return landingHead(loaderData as ServicePage, "Industries", "/industries");
  },
  component: IndustryPage,
});

function IndustryPage() {
  const page = Route.useLoaderData();
  return <ServiceLandingView page={page} hubLabel="Industries" hubPath="/industries" />;
}
