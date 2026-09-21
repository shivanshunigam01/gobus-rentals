import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotes,
});

type Q = { id: string; vendor: string; route: string; amount: string; status: string };
type Res = { quotes: Q[] };

function AdminQuotes() {
  const [view, setView] = useState<Q | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-quotes"],
    queryFn: () => api<Res>("/api/admin/quotes"),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const quotes = data?.quotes ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Quote Monitor</h1>
      <p className="text-muted-foreground text-sm mb-6">Track operator quotes across the platform</p>

      <ResponsiveTable minWidth="640px">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">Quote</th>
              <th className="text-left px-5 py-3 font-medium">Vendor</th>
              <th className="text-left px-5 py-3 font-medium">Route</th>
              <th className="text-left px-5 py-3 font-medium">Amount</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-mono text-xs">{q.id.slice(-8)}</td>
                <td className="px-5 py-3 text-foreground">{q.vendor}</td>
                <td className="px-5 py-3 text-muted-foreground">{q.route}</td>
                <td className="px-5 py-3 font-medium text-primary">{q.amount}</td>
                <td className="px-5 py-3 text-xs">{q.status}</td>
                <td className="px-5 py-3">
                  <Button variant="ghost" size="icon" className="h-7 w-7" type="button" onClick={() => setView(q)}><Eye className="w-3.5 h-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTable>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote</DialogTitle>
          </DialogHeader>
          {view ? <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(view, null, 2)}</pre> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
