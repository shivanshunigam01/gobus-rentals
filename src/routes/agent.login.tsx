import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { buildPageMeta } from "@/lib/seo/buildMeta";

/** Legacy URL — unified login at `/login` with B2B / agent portal pre-selected */
export const Route = createFileRoute("/agent/login")({
  component: AgentLoginRedirect,
  head: () =>
    buildPageMeta({
      title: "Agent Login",
      description: "B2B agent sign-in for Luxury Bus Rental.",
      path: "/agent/login",
      noindex: true,
    }),
});

function AgentLoginRedirect() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    navigate({ to: "/login", search: { role: "b2b" }, replace: true });
  }, [navigate]);
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-muted-foreground">
      Opening sign in…
    </div>
  );
}
