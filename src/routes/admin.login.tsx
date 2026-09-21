import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { buildPageMeta } from "@/lib/seo/buildMeta";

/** Legacy URL — unified login at `/login` with admin pre-selected */
export const Route = createFileRoute("/admin/login")({
  component: AdminLoginRedirect,
  head: () =>
    buildPageMeta({
      title: "Admin Login",
      description: "Admin sign-in for Luxury Bus Rental.",
      path: "/admin/login",
      noindex: true,
    }),
});

function AdminLoginRedirect() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    navigate({ to: "/login", search: { role: "admin" }, replace: true });
  }, [navigate]);
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-sm text-muted-foreground px-4">
      Opening sign in…
    </div>
  );
}
