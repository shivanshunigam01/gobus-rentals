import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { ServiceLandingView } from "@/components/landing/ServiceLandingView";
import { fetchServiceBySlug, type ServicePage } from "@/lib/api/content";
import { landingHead } from "@/lib/landingHead";
import { LEGACY_SERVICE_REDIRECTS } from "@/data/legacy-service-redirects";

export const Route = createFileRoute("/services/$serviceSlug")({
  loader: async ({ params }) => {
    const legacy = LEGACY_SERVICE_REDIRECTS[params.serviceSlug];
    if (legacy) {
      if (legacy === "/industries") throw redirect({ to: "/industries" });
      if (legacy.startsWith("/corporate/")) {
        throw redirect({ to: "/corporate/$slug", params: { slug: legacy.replace("/corporate/", "") } });
      }
      if (legacy.startsWith("/industries/")) {
        throw redirect({ to: "/industries/$slug", params: { slug: legacy.replace("/industries/", "") } });
      }
    }
    try {
      const page = await fetchServiceBySlug(params.serviceSlug);
      if (page.category === "corporate") {
        throw redirect({ to: "/corporate/$slug", params: { slug: page.slug } });
      }
      if (page.category === "industry") {
        throw redirect({ to: "/industries/$slug", params: { slug: page.slug } });
      }
      return page;
    } catch (e) {
      if (e && typeof e === "object" && ("to" in e || "status" in e || "isRedirect" in e)) throw e;
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return landingHead(loaderData as ServicePage, "Services", "/services");
  },
  component: ServicePageRoute,
});

function ServicePageRoute() {
  const page = Route.useLoaderData();
  return <ServiceLandingView page={page} hubLabel="Services" hubPath="/services" />;
}
