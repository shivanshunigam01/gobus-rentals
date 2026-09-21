import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Building2,
  FileSignature,
  LogIn,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { FloatingEmojiDecor } from "@/components/brand/FloatingEmojiDecor";
import { GlowBookingButton } from "@/components/motion/GlowBookingButton";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/company";

const b2bFeatures = [
  {
    icon: Users,
    emoji: "👥",
    title: "Employee accounts",
    desc: "Invite teams, assign travellers, and control who can book under your company.",
  },
  {
    icon: Briefcase,
    emoji: "🚌",
    title: "Bulk bus bookings",
    desc: "Shuttle routes, factory transfers, events, and recurring employee commute plans.",
  },
  {
    icon: Wallet,
    emoji: "💳",
    title: "Corporate wallet",
    desc: "Prepaid balance, credit limits, and consolidated spend tracking in one place.",
  },
  {
    icon: Receipt,
    emoji: "📄",
    title: "GST invoices",
    desc: "Downloadable invoices with transparent GST lines for finance and compliance.",
  },
  {
    icon: FileSignature,
    emoji: "📝",
    title: "Annual contracts",
    desc: "Long-term fleet agreements with negotiated rates for high-volume corporates.",
  },
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    title: "Verified operators",
    desc: "Compare quotes from approved vendors with audit-ready booking records.",
  },
];

export function B2BPortalSection() {
  return (
    <section id="b2b-portal" className="relative overflow-hidden border-y border-border bg-gradient-to-br from-primary/[0.06] via-background to-sky-500/[0.05] py-16 sm:py-20">
      <FloatingEmojiDecor variant="light" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              B2B corporate portal
            </span>
            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              💼 B2B Bus Rental for Companies &amp; HR Teams
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Register your organisation on {COMPANY.platformBrand} and manage employee transportation, shuttle
              bookings, invoices, and contracts from a dedicated corporate dashboard — not just one-off trips.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link to="/b2b/register">
              <GlowBookingButton emoji="🏢" className="w-full gap-2 sm:w-auto">
                Register B2B company
                <ArrowRight className="h-4 w-4" />
              </GlowBookingButton>
            </Link>
            <Link to="/login" search={{ role: "b2b" }}>
              <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
                <LogIn className="h-4 w-4" aria-hidden />
                B2B login
              </Button>
            </Link>
          </div>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {b2bFeatures.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                className="card-lift h-full rounded-2xl border border-border/90 bg-card/90 p-5 shadow-sm backdrop-blur-sm"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xl" aria-hidden>{feature.emoji}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" aria-hidden />
                  </span>
                </div>
                <h3 className="font-display font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                Already running employee shuttles or airport transfers?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                IT parks, BPOs, factories, hospitals, and event companies use our B2B portal for recurring bus hire
                with GST billing and centralised approvals.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link to="/corporate">
                <Button variant="secondary" className="w-full sm:w-auto">Explore corporate solutions</Button>
              </Link>
              <Link to="/b2b/register">
                <Button className="w-full gap-1.5 sm:w-auto">
                  Start B2B registration
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
