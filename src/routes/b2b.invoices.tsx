import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/b2b/invoices")({
  component: B2BInvoices,
});

function B2BInvoices() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["b2b-invoices"],
    queryFn: () =>
      api<{
        invoices: Array<{
          id: string;
          number: string;
          totalDisplay: string;
          status: string;
          gstAmount: number;
          issuedAt?: string;
        }>;
      }>("/api/b2b/invoices"),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Invoices</h1>
      <p className="text-muted-foreground text-sm mb-6">GST invoices for corporate bookings</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Number</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">GST</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.invoices ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No invoices yet
                </td>
              </tr>
            ) : (
              data!.invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                  <td className="px-4 py-3">{inv.totalDisplay}</td>
                  <td className="px-4 py-3">₹{Number(inv.gstAmount || 0).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 capitalize">{inv.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
