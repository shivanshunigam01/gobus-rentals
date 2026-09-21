import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/vendor/quotes")({
  component: VendorQuotes,
});

type Q = { id: string; lead: string; amount: string; status: string };
type Res = { quotes: Q[] };

const statusColor: Record<string, string> = {
  pending: "bg-chart-5/20 text-chart-5",
  accepted: "bg-chart-2/20 text-chart-2",
  declined: "bg-destructive/20 text-destructive",
  withdrawn: "bg-muted text-muted-foreground",
};

function VendorQuotes() {
  const [view, setView] = useState<Q | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-quotes"],
    queryFn: () => api<Res>("/api/vendor/quotes"),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const quotes = data?.quotes ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">My Quotes</h1>
      <p className="text-muted-foreground text-sm mb-6">Track all quotes you&apos;ve sent to customers</p>

      {quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-border rounded-xl p-8 text-center bg-card">No quotes sent yet.</p>
      ) : (
        <ResponsiveTable minWidth="560px">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Quote ID</th>
                <th className="text-left px-5 py-3 font-medium">Route</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{q.id.slice(-8)}</td>
                  <td className="px-5 py-3 text-foreground">{q.lead}</td>
                  <td className="px-5 py-3 font-medium text-primary">{q.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[q.status] ?? "bg-muted"}`}>{q.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7" type="button" onClick={() => setView(q)}><Eye className="w-3.5 h-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
      )}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote detail</DialogTitle>
          </DialogHeader>
          {view ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Quote ID</p>
                <p className="font-mono text-sm text-foreground">{view.id}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="text-sm font-medium text-foreground">{view.lead || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Quoted Price</p>
                  <p className="text-sm font-semibold text-primary">{view.amount || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground capitalize">{view.status || "pending"}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
