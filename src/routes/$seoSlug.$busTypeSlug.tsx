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
import { BUS_TYPE_ROUTES } from "@/data/city-bus-type-routes";
import { CapacityPage } from "@/components/CapacityPage";

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