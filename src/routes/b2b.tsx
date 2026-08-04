import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ResponsivePanelLayout } from "@/components/dashboards/ResponsivePanelLayout";
import { b2bPanelLinks } from "@/components/dashboards/panel-links";

export const Route = createFileRoute("/b2b")({
  component: B2BLayout,
});

function B2BLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = pathname === "/b2b/register";

  if (isPublic) {
    return <Outlet />;
  }

  return (
    <ResponsivePanelLayout links={b2bPanelLinks} panelLabel="B2B Portal" logoutTo="/login">
      <Outlet />
    </ResponsivePanelLayout>
  );
}
