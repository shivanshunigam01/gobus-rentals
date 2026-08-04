import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/customer/b2b-register")({
  beforeLoad: () => {
    throw redirect({ to: "/b2b/register" });
  },
  component: () => null,
});
