import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/notifications")({
  beforeLoad: () => {
    throw redirect({ to: "/vendor/dashboard" });
  },
  component: () => null,
});
