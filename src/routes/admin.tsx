import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ResponsivePanelLayout } from "@/components/dashboards/ResponsivePanelLayout";
import { adminPanelLinks } from "@/components/dashboards/panel-links";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <ResponsivePanelLayout
      links={adminPanelLinks}
      panelLabel="Admin Panel"
      panelLabelClassName="text-destructive font-semibold"
      logoutTo="/admin/login"
      showAdminTools
    >
      <Outlet />
    </ResponsivePanelLayout>
  );
}
