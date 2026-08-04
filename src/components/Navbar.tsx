import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/enterprise/ThemeToggle";
import { NAVBAR_CITY_WISE_LINKS } from "@/data/navbar-city-wise-links";
import { NAVBAR_BUS_TYPE_LINKS } from "@/data/navbar-bus-type-links";
import { NAVBAR_SERVICE_TYPE_LINKS, NavbarServiceTypeLink } from "@/data/service-links";

/** Scrollbar styling scoped only to the open City Wise panel (never the nav bar). */
const navDropdownPanelClass =
  "w-[min(100vw-2rem,22rem)] rounded-md border border-white/10 bg-[#1e1e1e] p-0 py-1 text-white shadow-xl";

const navDropdownPanelScrollClass =
  "max-h-[min(70vh,560px)] overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-track]:bg-white/5";

const navDropdownRowClass =
  "relative cursor-pointer rounded-none px-4 py-2.5 text-sm text-white outline-none transition-colors hover:bg-[#f1b424] hover:text-neutral-950 focus:bg-[#f1b424] focus:text-neutral-950 data-[highlighted]:bg-[#f1b424] data-[highlighted]:text-neutral-950";

/** Same row height as plain nav links — no extra bottom border/padding (avoids “floating” dropdown labels). */
const navCenterLinkClass =
  "inline-flex h-10 shrink-0 items-center whitespace-nowrap text-[0.9rem] font-medium text-foreground transition-colors hover:text-primary";

const navDropdownTriggerClass =
  "inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap border-0 bg-transparent p-0 text-[0.9rem] font-medium text-foreground outline-none transition-colors hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const navDropdownTriggerOpenClass = "text-amber-400";

/** Desktop City Wise menu without Radix (avoids React 19 + portal removeChild issues). */
function CityWiseDesktopMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    /** Bubble-phase click avoids racing React unmount vs link navigation (React 19 + removeChild). */
    const onDocClick = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative flex shrink-0 items-center" ref={wrapRef}>
      <button
        type="button"
        className={cn(navDropdownTriggerClass, open && navDropdownTriggerOpenClass)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        City Wise <span className="font-semibold">+</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={cn(
            navDropdownPanelClass,
            navDropdownPanelScrollClass,
            "absolute left-0 top-full z-[200] mt-1.5 py-1 shadow-2xl",
          )}
          role="menu"
        >
          {NAVBAR_CITY_WISE_LINKS.map((row) => (
            <Link
              key={row.label}
              to={row.to}
              role="menuitem"
              className={cn(
                navDropdownRowClass,
                "block w-full text-left no-underline focus-visible:z-10 focus-visible:outline-none",
              )}
              onClick={() => setOpen(false)}
            >
              {row.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-white/10" role="separator" />
          <Link
            to="/bus-rental"
            role="menuitem"
            className={cn(navDropdownRowClass, "block w-full text-left text-white/90 no-underline")}
            onClick={() => setOpen(false)}
          >
            All cities — bus rental
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function BusTypesDesktopMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative flex shrink-0 items-center" ref={wrapRef}>
      <button
        type="button"
        className={cn(navDropdownTriggerClass, open && navDropdownTriggerOpenClass)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        Bus types <span className="font-semibold">+</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={cn(
            navDropdownPanelClass,
            navDropdownPanelScrollClass,
            "absolute left-0 top-full z-[200] mt-1.5 py-1 shadow-2xl",
          )}
          role="menu"
        >
          {NAVBAR_BUS_TYPE_LINKS.map((row) => (
            <Link
              key={row.to}
              to={row.to as any}
              role="menuitem"
              className={cn(
                navDropdownRowClass,
                "block w-full text-left no-underline focus-visible:z-10 focus-visible:outline-none",
              )}
              onClick={() => setOpen(false)}
            >
              {row.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-white/10" role="separator" />
          <Link
            to="/bus-types-for-hire"
            role="menuitem"
            className={cn(navDropdownRowClass, "block w-full text-left text-white/90 no-underline")}
            onClick={() => setOpen(false)}
          >
            All bus types &amp; guide
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ServicesDesktopMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative flex shrink-0 items-center" ref={wrapRef}>
      <button
        type="button"
        className={cn(navDropdownTriggerClass, open && navDropdownTriggerOpenClass)}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        Services
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={cn(
            navDropdownPanelClass,
            navDropdownPanelScrollClass,
            "absolute left-0 top-full z-[200] mt-1.5 py-1 shadow-2xl",
          )}
          role="menu"
        >
          {NAVBAR_SERVICE_TYPE_LINKS.map((row: NavbarServiceTypeLink) => (
            <Link
              key={row.to}
              to={row.to as any}
              role="menuitem"
              className={cn(
                navDropdownRowClass,
                "block w-full text-left no-underline focus-visible:z-10 focus-visible:outline-none",
              )}
              onClick={() => setOpen(false)}
            >
              {row.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 overflow-visible bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6 md:py-0 lg:gap-10">
        <Link to="/" className="flex shrink-0 items-center gap-2 overflow-hidden">
          <img
            src="/images/logo.png"
            alt={COMPANY.platformBrand}
            className="h-12 max-h-12 w-auto max-w-[200px] object-contain object-left sm:max-w-[240px]"
            width={884}
            height={458}
            decoding="async"
          />
        </Link>

        <div className="hidden min-w-0 items-center justify-end gap-x-5 overflow-visible md:flex md:flex-nowrap lg:gap-x-7 xl:gap-x-8">
          <Link to="/" className={navCenterLinkClass} activeProps={{ className: `${navCenterLinkClass} text-primary` }}>
            Home
          </Link>
          <Link to="/about" className={navCenterLinkClass}>
            About
          </Link>
          <Link to="/blog" className={navCenterLinkClass}>
            Blog
          </Link>
          <Link to="/corporate" className={navCenterLinkClass}>
            Corporate
          </Link>
          <Link to="/industries" className={navCenterLinkClass}>
            Industries
          </Link>
          <CityWiseDesktopMenu />
          <BusTypesDesktopMenu />
          <ServicesDesktopMenu />
          <Link to="/bus-rental-guides" className={navCenterLinkClass}>
            Guides
          </Link>
          <Link to="/contact" className={navCenterLinkClass}>
            Contact
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-4 xl:gap-5">
          <ThemeToggle />
          <Link to="/book" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Book
          </Link>
          <Link to="/login">
            <Button variant="outline" size="default" className="gap-2">
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in
            </Button>
          </Link>
          <Link to="/book">
            <Button size="lg">Get Quotes</Button>
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground" aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3 animate-in slide-in-from-top-2">
          <Link to="/" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/about" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/blog" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link to="/corporate" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Corporate</Link>
          <Link to="/industries" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Industries</Link>
          <Link to="/services" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Services</Link>
          <details className="group rounded-lg border border-border bg-muted/20">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden flex items-center justify-between">
              City Wise +
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="max-h-[55vh] overflow-y-auto border-t border-border px-1 py-1">
              {NAVBAR_CITY_WISE_LINKS.map((row) => (
                <Link
                  key={row.label}
                  to={row.to}
                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-amber-400 hover:text-neutral-950"
                  onClick={() => setMobileOpen(false)}
                >
                  {row.label}
                </Link>
              ))}
              <Link
                to="/bus-rental"
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                All cities — bus rental
              </Link>
            </div>
          </details>
          <details className="group rounded-lg border border-border bg-muted/20">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden flex items-center justify-between">
              Bus types +
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="max-h-[55vh] overflow-y-auto border-t border-border px-1 py-1">
              {NAVBAR_BUS_TYPE_LINKS.map((row) => (
                <Link
                  key={row.to}
                  to={row.to as any}
                  className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-amber-400 hover:text-neutral-950"
                  onClick={() => setMobileOpen(false)}
                >
                  {row.label}
                </Link>
              ))}
              <Link
                to="/bus-types-for-hire"
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                All bus types &amp; guide
              </Link>
            </div>
          </details>
          <Link to="/bus-rental-guides" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Guides</Link>
          <Link to="/contact" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>Contact</Link>
          <Link to="/book" className="block py-2 text-sm font-medium text-foreground" onClick={() => setMobileOpen(false)}>
            Book
          </Link>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="outline" className="w-full gap-2" size="lg" type="button">
              <LogIn className="h-4 w-4" aria-hidden />
              Sign in
            </Button>
          </Link>
          <Link to="/book" onClick={() => setMobileOpen(false)}>
            <Button className="w-full" size="lg">Get Quotes</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
