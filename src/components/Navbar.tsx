import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { SITE_LOGO_PATH } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/enterprise/ThemeToggle";
import { NAVBAR_CITY_WISE_LINKS } from "@/data/navbar-city-wise-links";
import { NAVBAR_BUS_TYPE_LINKS } from "@/data/navbar-bus-type-links";
import { NAVBAR_SERVICE_TYPE_LINKS, NavbarServiceTypeLink } from "@/data/service-links";

const navDropdownPanelClass =
  "w-[min(100vw-2rem,22rem)] rounded-md border border-white/10 bg-[#1e1e1e] p-0 py-1 text-white shadow-xl";

const navDropdownPanelScrollClass =
  "max-h-[min(70vh,560px)] overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-track]:bg-white/5";

const navDropdownRowClass =
  "relative cursor-pointer rounded-none px-4 py-2.5 text-sm text-white outline-none transition-colors hover:bg-[#f1b424] hover:text-neutral-950 focus:bg-[#f1b424] focus:text-neutral-950";

const navCenterLinkClass =
  "inline-flex h-10 shrink-0 items-center whitespace-nowrap text-sm font-medium text-foreground transition-colors hover:text-primary";

const navDropdownTriggerClass =
  "inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap border-0 bg-transparent p-0 text-sm font-medium text-foreground outline-none transition-colors hover:text-amber-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function useNavDropdown() {
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

  return { open, setOpen, wrapRef };
}

function NavDropdown({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const { open, setOpen, wrapRef } = useNavDropdown();

  return (
    <div className="relative flex shrink-0 items-center" ref={wrapRef}>
      <button
        type="button"
        className={cn(navDropdownTriggerClass, open && "text-amber-400")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-70 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <motion.div
          className={cn(
            navDropdownPanelClass,
            navDropdownPanelScrollClass,
            "absolute left-0 top-full z-[200] mt-1.5 py-1 shadow-2xl",
          )}
          role="menu"
          onClick={() => setOpen(false)}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src={SITE_LOGO_PATH}
            alt={COMPANY.platformBrand}
            className="h-11 w-auto max-w-[180px] object-contain object-left sm:h-12 sm:max-w-[220px]"
            width={884}
            height={458}
            decoding="async"
          />
        </Link>

        {/* Desktop — xl+ only; tablets use hamburger menu */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 px-2 xl:flex xl:gap-x-5">
          <Link to="/" className={navCenterLinkClass} activeProps={{ className: `${navCenterLinkClass} text-primary` }}>
            Home
          </Link>
          <Link to="/about" className={navCenterLinkClass}>
            About
          </Link>
          <Link to="/blog" className={cn(navCenterLinkClass, "hidden 2xl:inline-flex")}>
            Blog
          </Link>
          <NavDropdown label="City Wise">
            {NAVBAR_CITY_WISE_LINKS.map((row) => (
              <Link
                key={row.label}
                to={row.to}
                role="menuitem"
                className={cn(navDropdownRowClass, "block w-full text-left no-underline")}
              >
                {row.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-white/10" role="separator" />
            <Link to="/bus-rental" role="menuitem" className={cn(navDropdownRowClass, "block w-full text-left text-white/90 no-underline")}>
              All cities — bus rental
            </Link>
          </NavDropdown>
          <NavDropdown label="Bus types">
            {NAVBAR_BUS_TYPE_LINKS.map((row) => (
              <Link
                key={row.to}
                to={row.to as never}
                role="menuitem"
                className={cn(navDropdownRowClass, "block w-full text-left no-underline")}
              >
                {row.label}
              </Link>
            ))}
            <div className="my-1 h-px bg-white/10" role="separator" />
            <Link to="/bus-types-for-hire" role="menuitem" className={cn(navDropdownRowClass, "block w-full text-left text-white/90 no-underline")}>
              All bus types &amp; guide
            </Link>
          </NavDropdown>
          <NavDropdown label="Services">
            {NAVBAR_SERVICE_TYPE_LINKS.map((row: NavbarServiceTypeLink) => (
              <Link
                key={row.to}
                to={row.to as never}
                role="menuitem"
                className={cn(navDropdownRowClass, "block w-full text-left no-underline")}
              >
                {row.label}
              </Link>
            ))}
          </NavDropdown>
          <Link to="/bus-rental-guides" className={cn(navCenterLinkClass, "hidden xl:inline-flex")}>
            Guides
          </Link>
          <Link to="/contact" className={navCenterLinkClass}>
            Contact
          </Link>
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex xl:gap-3">
          <ThemeToggle />
          <Link to="/book" className="hidden text-sm font-medium text-foreground hover:text-primary 2xl:inline">
            Book
          </Link>
          <Link to="/login">
            <Button variant="outline" size="default" className="gap-2">
              <LogIn className="h-4 w-4" aria-hidden />
              <span className="hidden 2xl:inline">Sign in</span>
              <span className="2xl:hidden">Login</span>
            </Button>
          </Link>
          <Link to="/book">
            <Button size="default" className="whitespace-nowrap">Get Quotes</Button>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="border-b border-border bg-card px-4 pb-4 xl:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="max-h-[75vh] space-y-1 overflow-y-auto pt-2">
            <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/about" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/blog" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
            <details className="group rounded-lg border border-border bg-muted/20">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
                City Wise
                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
              </summary>
              <div className="max-h-48 overflow-y-auto border-t border-border px-1 py-1">
                {NAVBAR_CITY_WISE_LINKS.map((row) => (
                  <Link key={row.label} to={row.to} className="block rounded-md px-3 py-2 text-sm hover:bg-amber-400 hover:text-neutral-950" onClick={() => setMobileOpen(false)}>
                    {row.label}
                  </Link>
                ))}
              </div>
            </details>
            <details className="group rounded-lg border border-border bg-muted/20">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
                Bus types
                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
              </summary>
              <div className="max-h-48 overflow-y-auto border-t border-border px-1 py-1">
                {NAVBAR_BUS_TYPE_LINKS.map((row) => (
                  <Link key={row.to} to={row.to as never} className="block rounded-md px-3 py-2 text-sm hover:bg-amber-400 hover:text-neutral-950" onClick={() => setMobileOpen(false)}>
                    {row.label}
                  </Link>
                ))}
              </div>
            </details>
            <details className="group rounded-lg border border-border bg-muted/20">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
                Services
                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
              </summary>
              <div className="max-h-48 overflow-y-auto border-t border-border px-1 py-1">
                {NAVBAR_SERVICE_TYPE_LINKS.map((row) => (
                  <Link key={row.to} to={row.to as never} className="block rounded-md px-3 py-2 text-sm hover:bg-amber-400 hover:text-neutral-950" onClick={() => setMobileOpen(false)}>
                    {row.label}
                  </Link>
                ))}
              </div>
            </details>
            <Link to="/bus-rental-guides" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Guides</Link>
            <Link to="/contact" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link to="/book" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Book</Link>
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="mt-2 w-full gap-2" size="lg">
                <LogIn className="h-4 w-4" /> Sign in
              </Button>
            </Link>
            <Link to="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" size="lg">Get Quotes</Button>
            </Link>
          </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
