import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { buildPageMeta } from "@/lib/seo/buildMeta";

/** Legacy-style URL — unified login at `/login` with customer portal pre-selected */
export const Route = createFileRoute("/customer/login")({
  component: CustomerLoginRedirect,
  head: () =>
    buildPageMeta({
      title: "Customer Login",
      description: "Customer sign-in for Luxury Bus Rental.",
      path: "/customer/login",
      noindex: true,
    }),
});

function CustomerLoginRedirect() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    navigate({ to: "/login", search: { role: "customer" }, replace: true });
  }, [navigate]);
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-muted-foreground">
      Opening sign in…
    </div>
  );
}
