// import { createFileRoute, redirect } from "@tanstack/react-router";

// export const Route = createFileRoute("/$seoSlug/$busTypeSlug")({
//   beforeLoad: ({ params }) => {
//     throw redirect({
//       to: "/$seoSlug/rental/$busTypeSlug",
//       params: { seoSlug: params.seoSlug, busTypeSlug: params.busTypeSlug },
//       replace: true,
//     });
//   },
//   component: () => null,
// });


import { createFileRoute, redirect } from "@tanstack/react-router";
import { VEHICLE_CATALOG } from "@/lib/vehicle-catalog";
import { CapacityPage } from "@/components/CapacityPage";
import { getCityBySlug } from "@/data/indian-cities";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { COMPANY } from "@/lib/company";
import { vehicleRentalSchema } from "@/lib/seo/schemas";

export const Route = createFileRoute("/$seoSlug/$busTypeSlug")({
  beforeLoad: ({ params }) => {
    const isCapacityType = VEHICLE_CATALOG.some(
      (v) => v.slug === params.busTypeSlug
    );

    if (!isCapacityType) {
      throw redirect({
        to: "/$seoSlug/rental/$busTypeSlug",
        params: {
          seoSlug: params.seoSlug,
          busTypeSlug: params.busTypeSlug,
        },
        replace: true,
      });
    }
  },

  head: ({ params }) => {
    const city = getCityBySlug(params.seoSlug);
    const vehicle = VEHICLE_CATALOG.find((v) => v.slug === params.busTypeSlug);
    if (!city || !vehicle) return {};
    const path = `/${city.slug}/${vehicle.slug}`;
    const { meta, links } = buildPageMeta({
      title: `${vehicle.title} in ${city.name} | Capacity & Booking`,
      description: `Book ${vehicle.title.toLowerCase()} in ${city.name} with ${COMPANY.legalName}. Compare verified operator quotes with transparent GST pricing on ${COMPANY.platformBrand}.`,
      path,
      keywords: `${vehicle.title} ${city.name}, ${vehicle.seats} bus rental ${city.name}, bus hire ${city.name}`,
    });
    return {
      meta: [
        ...meta,
        {
          "script:ld+json": vehicleRentalSchema({
            name: `${vehicle.title} rental in ${city.name}`,
            description: vehicle.description,
            path,
          }),
        },
      ],
      links,
    };
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { busTypeSlug } = Route.useParams();

  const vehicle = VEHICLE_CATALOG.find(
    (v) => v.slug === busTypeSlug
  );

  if (!vehicle) return null;

  return (
    <div>
      <h1>{vehicle.title}</h1>
      <CapacityPage vehicle={vehicle} />
      {/* capacity page content */}
    </div>
  );
}