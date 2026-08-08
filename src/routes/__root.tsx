import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { queryClient } from "@/lib/query-client";
import { Toaster } from "@/components/ui/sonner";
import { StickyLeadBar } from "@/components/seo/StickyLeadBar";
import { ThemeProvider } from "@/lib/theme";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_TWITTER_HANDLE, absoluteUrl } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `Kartar Travels — Luxury bus rental across North India | ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Kartar Travels Private Limited — Volvo, Mercedes-Benz, seater & sleeper buses. Chandigarh, Delhi, Punjab, Haryana, Himachal & North India. Compare quotes and book with GST-transparent pricing.",
      },
      { name: "author", content: "Kartar Travels Private Limited" },
      {
        name: "keywords",
        content:
          "bus rental India, luxury bus hire, bus hire online, Volvo bus rental, wedding bus rental, corporate bus hire, tempo traveller booking, group travel bus, bus rental Delhi, bus rental Mumbai, Luxury Bus Rental",
      },
      { property: "og:title", content: "Kartar Travels — Premium bus rental marketplace" },
      {
        property: "og:description",
        content:
          "Trusted luxury bus rentals since 2018. Safe, reliable travel across North India at competitive prices with clear GST on every booking.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:locale", content: "en_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SITE_TWITTER_HANDLE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      { "script:ld+json": organizationSchema() },
      { "script:ld+json": websiteSchema() },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/images/logo.svg",
      },
      {
        rel: "apple-touch-icon",
        href: "/images/logo.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideSticky =
    /^\/admin(\/|$)/.test(pathname) ||
    /^\/vendor(\/|$)/.test(pathname) ||
    /^\/customer(\/|$)/.test(pathname) ||
    /^\/b2b(\/|$)/.test(pathname) ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup";

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div id="main-content" className={hideSticky ? "" : "pb-16 md:pb-0 min-h-screen"}>
          <Outlet />
        </div>
        {!hideSticky ? <StickyLeadBar /> : null}
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function RootErrorComponent({ error }: Readonly<{ error: Error }>) {
  const msg = error?.message || "Unexpected application error";
  const isDomRemoveChildRace = msg.includes("removeChild") && msg.includes("not a child of this node");

  useEffect(() => {
    if (globalThis.window === undefined || !isDomRemoveChildRace) return;
    const key = "__lbr_removeChild_recovered__";
    const alreadyRecovered = sessionStorage.getItem(key) === "1";
    if (!alreadyRecovered) {
      sessionStorage.setItem(key, "1");
      globalThis.window.setTimeout(() => globalThis.window.location.reload(), 50);
    }
  }, [isDomRemoveChildRace]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold text-foreground">Page recovery in progress</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isDomRemoveChildRace
            ? "A temporary UI race condition was detected. The app has been refreshed."
            : msg}
        </p>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => globalThis.window.location.reload()}
          >
            Reload now
          </button>
        </div>
      </div>
    </div>
  );
}
