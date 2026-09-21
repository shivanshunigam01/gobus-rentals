import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IndianRupee, TrendingUp, ArrowDownRight, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPayments,
});

type P = {
  id: string;
  booking: string;
  vendor: string;
  amount: string;
  commission: string;
  payout: string;
  status: string;
  date: string;
};

type Res = { payments: P[] };

function AdminPayments() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: () => api<Res>("/api/admin/payments"),
  });

  const refundMut = useMutation({
    mutationFn: (id: string) => api("/api/admin/payments/" + id + "/refund", { method: "POST" }),
    onSuccess: () => {
      toast.success("Refund recorded");
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const payments = data?.payments ?? [];
  const totalRev = payments.filter((p) => p.status === "Paid").length;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Payment Management</h1>
      <p className="text-muted-foreground text-sm mb-6">Commission tracking, refunds, and vendor payouts</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Recorded payments", value: String(payments.length), icon: IndianRupee, color: "text-chart-2" },
          { label: "Completed", value: String(totalRev), icon: TrendingUp, color: "text-primary" },
          { label: "Pending rows", value: String(payments.filter((p) => p.status === "Pending").length), icon: ArrowDownRight, color: "text-chart-5" },
          { label: "Refunded", value: String(payments.filter((p) => p.status === "Refunded").length), icon: RefreshCw, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-5">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <span className={`font-display text-lg font-bold ${s.color} block`}>{s.value}</span>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <ResponsiveTable minWidth="720px">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Payment ID</th>
              <th className="text-left px-5 py-3 font-medium">Booking</th>
              <th className="text-left px-5 py-3 font-medium">Vendor</th>
              <th className="text-left px-5 py-3 font-medium">Amount</th>
              <th className="text-left px-5 py-3 font-medium">Commission</th>
              <th className="text-left px-5 py-3 font-medium">Payout</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Date</th>
              <th className="text-left px-5 py-3 font-medium">Refund</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{p.id.slice(-8)}</td>
                <td className="px-5 py-3 text-foreground">{p.booking}</td>
                <td className="px-5 py-3 text-foreground">{p.vendor}</td>
                <td className="px-5 py-3 font-medium text-foreground">{p.amount}</td>
                <td className="px-5 py-3 text-primary">{p.commission}</td>
                <td className="px-5 py-3 font-medium text-chart-2">{p.payout}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "Paid" ? "bg-chart-2/20 text-chart-2" : p.status === "Pending" ? "bg-chart-5/20 text-chart-5" : p.status === "On hold" ? "bg-destructive/20 text-destructive" : p.status === "Collected" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{p.status}</span></td>
                <td className="px-5 py-3 text-muted-foreground">{p.date}</td>
                <td className="px-5 py-3">
                  {(p.status === "Paid" || p.status === "Collected") && (
                    <Button variant="outline" size="sm" className="text-xs h-7" type="button" disabled={refundMut.isPending} onClick={() => refundMut.mutate(p.id)}>Refund</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTable>
    </div>
  );
}
