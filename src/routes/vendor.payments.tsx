import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/payments")({
  component: VendorPayments,
});

function VendorPayments() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: () =>
      api<{ balanceDisplay: string; transactions: any[] }>("/api/vendor/wallet"),
  });

  if (isLoading) return <div className={panelStatePadding}>Loading wallet…</div>;

  return (
    <div className={panelPage}>
      <h1 className="text-2xl font-bold mb-1">Payments & Wallet</h1>
      <p className="text-muted-foreground text-sm mb-6">Track credits, debits, and payouts</p>
      <div className="rounded-xl border bg-card p-6 mb-6">
        <p className="text-sm text-muted-foreground">Available balance</p>
        <p className="text-3xl font-bold text-primary mt-1">{data?.balanceDisplay || "₹0"}</p>
      </div>
      <div className="space-y-2">
        {(data?.transactions || []).length === 0 && (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        )}
        {(data?.transactions || []).map((t) => (
          <div key={t.id} className="border rounded-lg p-3 flex justify-between bg-card">
            <div>
              <p className="font-medium capitalize">{t.type}</p>
              <p className="text-xs text-muted-foreground">{t.note || t.reference || "—"}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{t.amountDisplay}</p>
              <p className="text-xs text-muted-foreground">
                {t.date ? new Date(t.date).toLocaleDateString("en-IN") : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
