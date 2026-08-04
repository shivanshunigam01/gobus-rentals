import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/payments")({
  component: B2BPayments,
});

function B2BPayments() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-payments"],
    queryFn: () =>
      api<{ history: Array<{ id: string; amount: string; status: string; purpose: string; date: string }> }>(
        "/api/b2b/payments",
      ),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Payments</h1>
      <p className="text-muted-foreground text-sm mb-6">Corporate payment history</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Purpose</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {(data?.history ?? []).map((h) => (
              <tr key={h.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{h.amount}</td>
                <td className="px-4 py-3">{h.purpose}</td>
                <td className="px-4 py-3">{h.status}</td>
                <td className="px-4 py-3">{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
