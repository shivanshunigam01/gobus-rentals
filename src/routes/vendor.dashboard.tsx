import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bus, ClipboardList, IndianRupee, Star, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/dashboard")({
  component: VendorDashboard,
});

type DashRes = {
  totalBuses: string;
  activeLeads: string;
  confirmedBookings: string;
  totalEarnings: string;
  netAfterCommission?: string;
  commissionPercent?: number;
  payoutRule?: string;
  avgRating: string;
  thisMonth: string;
  recentLeads: Array<{
    id: string;
    customer: string;
    route: string;
    date: string;
    bus: string;
    status: string;
  }>;
};

function VendorDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-dashboard-stats"],
    queryFn: () => api<DashRes>("/api/vendor/dashboard-stats"),
  });
  const profileQ = useQuery({
    queryKey: ["vendor-portal-profile"],
    queryFn: () => api<any>("/api/vendor/profile"),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading dashboard…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const profile = profileQ.data;
  const needsOnboarding = profile && (profile.registrationStep < 4 || profile.status === "pending");

  const stats = [
    { label: "Total Buses", value: data?.totalBuses ?? "0", icon: Bus, color: "text-primary" },
    { label: "Active Leads", value: data?.activeLeads ?? "0", icon: ClipboardList, color: "text-chart-5" },
    { label: "Confirmed Bookings", value: data?.confirmedBookings ?? "0", icon: Users, color: "text-chart-2" },
    { label: "Total Earnings", value: data?.totalEarnings ?? "₹0", icon: IndianRupee, color: "text-chart-4" },
    { label: "Avg Rating", value: data?.avgRating ?? "—", icon: Star, color: "text-chart-5" },
    { label: "This Month (est.)", value: data?.thisMonth ?? "₹0", icon: TrendingUp, color: "text-primary" },
  ];

  const recentLeads = data?.recentLeads ?? [];

  return (
    <div className={panelPage.standard}>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Vendor Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your bus rental business</p>
        {needsOnboarding && (
          <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">Complete verification to receive leads</p>
            <p className="text-muted-foreground mt-1">
              Account status: <strong>{profile.status}</strong> · Docs: {profile.documentsStatus} · Step {profile.registrationStep}/4
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Button asChild size="sm" variant="outline"><Link to="/vendor/documents">Upload documents</Link></Button>
              <Button asChild size="sm" variant="outline"><Link to="/vendor/fleet">Add fleet</Link></Button>
              <Button asChild size="sm" variant="outline"><Link to="/vendor/profile">Update profile</Link></Button>
            </div>
          </div>
        )}
        <div className="mt-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground break-words">
          <p className="font-medium text-foreground">Commission &amp; payouts</p>
          <p className="mt-1">
            Platform fee: <span className="text-destructive font-medium">{data?.commissionPercent ?? 10}%</span> deducted from your rental
            (subtotal, before GST).{" "}
            {data?.payoutRule ?? "Automatic payout after you mark the trip completed (full customer payment required)."}{" "}
            Net paid out (completed): <span className="text-chart-2 font-medium">{data?.netAfterCommission ?? "₹0"}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 sm:p-5">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <span className={`font-display text-xl font-bold ${s.color} block`}>{s.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">Recent Leads</h2>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link to="/vendor/leads">
              <Button variant="default" size="sm" className="gap-1">
                Manage leads <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link to="/vendor/bookings">
              <Button variant="outline" size="sm" className="gap-1">
                Bookings
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {recentLeads.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Lead ID</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Route</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Bus Type</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{l.id.slice(-8)}</td>
                    <td className="px-5 py-3 text-foreground">{l.customer}</td>
                    <td className="px-5 py-3 text-foreground">{l.route}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.date}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.bus}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.status === "New" ? "bg-primary/20 text-primary" : "bg-chart-4/20 text-chart-4"}`}>{l.status}</span></td>
                    <td className="px-5 py-3 text-right">
                      <Link to="/vendor/leads">
                        <Button variant="outline" size="sm" type="button" className="text-xs h-7">
                          Open
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
