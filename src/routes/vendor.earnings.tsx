import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IndianRupee, TrendingUp, Clock, Percent, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/earnings")({
  component: VendorEarnings,
});

type Tx = {
  id: string;
  booking: string;
  amount: string;
  commission: string;
  net: string;
  date: string;
  status: string;
};

type Res = {
  totalEarnings: string;
  netPayoutTotal?: string;
  pendingPayments: number;
  thisMonth: string;
  commissionDisplay: string;
  payoutRule?: string;
  transactions: Tx[];
};

function VendorEarnings() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-earnings"],
    queryFn: () => api<Res>("/api/vendor/earnings"),
  });
  const payoutsQ = useQuery({
    queryKey: ["vendor-payouts"],
    queryFn: () =>
      api<{
        payouts: Array<{
          id: string;
          amountRequestedDisplay: string;
          amountApprovedDisplay: string;
          status: string;
          transactionId: string;
          createdAt?: string;
        }>;
      }>("/api/vendor/payouts"),
  });
  const requestPayout = useMutation({
    mutationFn: () => api("/api/vendor/payouts", { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => {
      toast.success("Payout request submitted");
      qc.invalidateQueries({ queryKey: ["vendor-payouts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const transactions = data?.transactions ?? [];

  return (
    <div className={panelPage.standard}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Earnings Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your revenue and pending payouts</p>
        </div>
        <Button type="button" disabled={requestPayout.isPending} onClick={() => requestPayout.mutate()}>
          Request payout
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-6 rounded-lg border border-border bg-muted/30 px-3 py-2">
        {data?.payoutRule ?? "Automatic payout runs after trip completion. Commission is deducted on your side before payout."}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Gross (completed)", value: data?.totalEarnings ?? "₹0", icon: IndianRupee, color: "text-chart-2" },
          { label: "Net paid out", value: data?.netPayoutTotal ?? "₹0", icon: TrendingUp, color: "text-primary" },
          { label: "Pending payout rows", value: String(data?.pendingPayments ?? 0), icon: Clock, color: "text-chart-5" },
          { label: "Commission rate", value: data?.commissionDisplay ?? "10%", icon: Percent, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <span className={`font-display text-lg font-bold ${s.color} block`}>{s.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">Payment records</h2>
          <Link to="/vendor/bookings" className="shrink-0">
            <Button variant="outline" size="sm" type="button" className="gap-1.5 w-full sm:w-auto">
              <ClipboardList className="w-3.5 h-3.5" />
              Update booking statuses
            </Button>
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No completed trips yet. After you mark a booking completed (and the customer has paid in full), payout rows appear here.</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Txn</th>
                <th className="text-left px-5 py-3 font-medium">Booking</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Commission</th>
                <th className="text-left px-5 py-3 font-medium">Net Payout</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium text-foreground">{t.id}</td>
                  <td className="px-5 py-3 text-foreground font-mono text-xs">{t.booking}</td>
                  <td className="px-5 py-3 text-foreground">{t.amount}</td>
                  <td className="px-5 py-3 text-destructive">{t.commission}</td>
                  <td className="px-5 py-3 font-medium text-chart-2">{t.net}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === "Paid" ? "bg-chart-2/20 text-chart-2" : t.status === "Refunded" ? "bg-destructive/20 text-destructive" : "bg-chart-5/20 text-chart-5"}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-display font-semibold text-foreground">Payout requests</h2>
        </div>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">Requested</th>
              <th className="px-5 py-3 text-left font-medium">Approved</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">UTR</th>
            </tr>
          </thead>
          <tbody>
            {(payoutsQ.data?.payouts ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-muted-foreground">
                  No payout requests yet
                </td>
              </tr>
            ) : (
              payoutsQ.data!.payouts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{p.amountRequestedDisplay}</td>
                  <td className="px-5 py-3">{p.amountApprovedDisplay}</td>
                  <td className="px-5 py-3 capitalize">{p.status}</td>
                  <td className="px-5 py-3 font-mono text-xs">{p.transactionId || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
