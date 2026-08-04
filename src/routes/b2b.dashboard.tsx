import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, BookOpen, Bus, Receipt, Users, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/dashboard")({
  component: B2BDashboard,
});

type Dash = {
  company: {
    companyName: string;
    status: string;
    walletBalance: number;
    creditLimit: number;
    defaultDiscountPercent: number;
  };
  stats: {
    totalBookings: number;
    activeBookings: number;
    completedTrips: number;
    totalSpendDisplay: string;
    openInvoices: number;
    employees: number;
  };
};

function B2BDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-dashboard"],
    queryFn: () => api<Dash>("/api/b2b/dashboard"),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const c = data?.company;
  const s = data?.stats;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Corporate Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-2">{c?.companyName}</p>
      <p className="mb-6 text-xs">
        Status:{" "}
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium capitalize">{c?.status}</span>
        {c?.status === "pending" && (
          <span className="ml-2 text-muted-foreground">Admin approval required before booking.</span>
        )}
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {[
          { label: "Active bookings", value: String(s?.activeBookings ?? 0), icon: BookOpen },
          { label: "Completed trips", value: String(s?.completedTrips ?? 0), icon: Bus },
          { label: "Total spend", value: s?.totalSpendDisplay ?? "₹0", icon: Wallet },
          { label: "Open invoices", value: String(s?.openInvoices ?? 0), icon: Receipt },
          { label: "Employees", value: String(s?.employees ?? 0), icon: Users },
          { label: "Credit limit", value: `₹${Number(c?.creditLimit || 0).toLocaleString("en-IN")}`, icon: Briefcase },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-5">
            <item.icon className="mb-2 h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-foreground block">{item.value}</span>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/b2b/bookings" className="text-sm text-primary hover:underline">
          View bookings
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link to="/b2b/employees" className="text-sm text-primary hover:underline">
          Manage employees
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link to="/b2b/contracts" className="text-sm text-primary hover:underline">
          Contracts
        </Link>
      </div>
    </div>
  );
}
