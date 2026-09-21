import { createFileRoute, notFound, isRedirect } from "@tanstack/react-router";
import { ServiceLandingView } from "@/components/landing/ServiceLandingView";
import { fetchServiceBySlug, type ServicePage } from "@/lib/api/content";
import { getLocalServiceBySlug } from "@/lib/local-content-api";
import { landingHead } from "@/lib/landingHead";

export const Route = createFileRoute("/corporate/$slug")({
  loader: async ({ params }) => {
    try {
      const page = await fetchServiceBySlug(params.slug);
      if (page.category !== "corporate") throw notFound();
      return page;
    } catch (e) {
      if (isRedirect(e)) throw e;
      const local = getLocalServiceBySlug(params.slug);
      if (local && local.category === "corporate") return local as ServicePage;
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return landingHead(loaderData as ServicePage, "Corporate", "/corporate");
  },
  component: CorporatePage,
});

function CorporatePage() {
  const page = Route.useLoaderData();
  return <ServiceLandingView page={page} hubLabel="Corporate" hubPath="/corporate" />;
}
