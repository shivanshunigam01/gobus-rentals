import { useState, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuth } from "@/lib/auth-storage";
import { COMPANY } from "@/lib/company";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { PanelNavLink } from "./panel-links";
import { ThemeToggle } from "@/components/enterprise/ThemeToggle";
import { GlobalSearch } from "@/components/enterprise/GlobalSearch";
import { NotificationBell } from "@/components/enterprise/NotificationBell";

type Props = {
  links: PanelNavLink[];
  /** Shown under logo on desktop; truncated in mobile header */
  panelLabel: string;
  /** Extra classes for panel label under logo (e.g. admin destructive) */
  panelLabelClassName?: string;
  logoutTo: string;
  /** e.g. Login button when browsing the customer shell without a session */
  mobileHeaderEnd?: ReactNode;
  showAdminTools?: boolean;
  notificationBasePath?: string;
  children: ReactNode;
};

function NavList({
  links,
  pathname,
  onNavigate,
}: {
  links: PanelNavLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-11 touch-manipulation",
            pathname === link.to
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted",
          )}
        >
          <link.icon className="w-4 h-4 shrink-0" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarHeader({ panelLabel, panelLabelClassName }: Pick<Props, "panelLabel" | "panelLabelClassName">) {
  return (
    <div className="p-4 sm:p-5 border-b border-border shrink-0">
      <Link to="/" className="flex items-center gap-2 min-h-10" onClick={() => undefined}>
        <img
          src="/images/logo.svg"
          alt={COMPANY.platformBrand}
          className="h-9 w-auto max-w-[200px] object-contain object-left"
          width={884}
          height={458}
          decoding="async"
        />
      </Link>
      <p className={cn("text-xs mt-1.5", panelLabelClassName ?? "text-muted-foreground")}>{panelLabel}</p>
    </div>
  );
}

export function ResponsivePanelLayout({
  links,
  panelLabel,
  panelLabelClassName,
  logoutTo,
  mobileHeaderEnd,
  showAdminTools = false,
  notificationBasePath = "/api/enterprise",
  children,
}: Props) {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);
  const tools = (
    <div className="flex items-center gap-2">
      {showAdminTools ? <GlobalSearch /> : null}
      <NotificationBell basePath={notificationBasePath} />
      <ThemeToggle />
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface flex flex-col lg:flex-row">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-3 pt-[env(safe-area-inset-top)] shrink-0">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="shrink-0 h-10 w-10" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(100vw-1rem,20rem)] p-0 flex flex-col sm:max-w-xs">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarHeader panelLabel={panelLabel} panelLabelClassName={panelLabelClassName} />
            <NavList links={links} pathname={pathname} onNavigate={closeMobile} />
            <div className="p-3 border-t border-border mt-auto pb-[max(12px,env(safe-area-inset-bottom))]">
              <Link
                to={logoutTo}
                onClick={() => {
                  clearAuth();
                  closeMobile();
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground min-h-11"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex min-w-0 items-center gap-2 flex-1" onClick={closeMobile}>
          <img
            src="/images/logo.svg"
            alt=""
            className="h-8 w-auto max-h-8 object-contain object-left shrink-0"
            width={884}
            height={458}
            decoding="async"
          />
          <span className={cn("text-xs font-medium truncate", panelLabelClassName ?? "text-muted-foreground")}>
            {panelLabel}
          </span>
        </Link>
        <div className="shrink-0 flex items-center gap-2">
          {tools}
          {mobileHeaderEnd}
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-card border-r border-border min-h-0 lg:min-h-screen flex-col shrink-0">
        <SidebarHeader panelLabel={panelLabel} panelLabelClassName={panelLabelClassName} />
        <NavList links={links} pathname={pathname} />
        <div className="p-3 border-t border-border mt-auto space-y-2">
          <div className="flex items-center justify-between gap-2 px-1">{tools}</div>
          <Link
            to={logoutTo}
            onClick={() => clearAuth()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </Link>
        </div>
      </aside>

      <main id="panel-main" className="flex-1 min-w-0 min-h-0 overflow-x-hidden pb-[env(safe-area-inset-bottom)]" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
