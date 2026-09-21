import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { buildPageMeta } from "@/lib/seo/buildMeta";

/** Legacy URL — unified login at `/login` with vendor pre-selected */
export const Route = createFileRoute("/vendor/login")({
  component: VendorLoginRedirect,
  head: () =>
    buildPageMeta({
      title: "Vendor Login",
      description: "Vendor sign-in for Luxury Bus Rental.",
      path: "/vendor/login",
      noindex: true,
    }),
});

function VendorLoginRedirect() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    navigate({ to: "/login", search: { role: "vendor" }, replace: true });
  }, [navigate]);
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground px-4">
      Opening sign in…
    </div>
  );
}
