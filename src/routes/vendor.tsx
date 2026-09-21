import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ResponsivePanelLayout } from "@/components/dashboards/ResponsivePanelLayout";
import { vendorPanelLinks } from "@/components/dashboards/panel-links";

export const Route = createFileRoute("/vendor")({
  component: VendorLayout,
});

function VendorLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isVendorPublicPage = pathname === "/vendor/register" || pathname === "/vendor/login";

  if (isVendorPublicPage) {
    return <Outlet />;
  }

  return (
    <ResponsivePanelLayout
      links={vendorPanelLinks}
      panelLabel="Vendor Panel"
      logoutTo="/vendor/login"
      showNotifications={false}
    >
      <Outlet />
    </ResponsivePanelLayout>
  );
}
