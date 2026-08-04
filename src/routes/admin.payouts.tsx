import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-storage";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/payouts")({
  component: AdminPayouts,
});

type Payout = {
  id: string;
  vendor: string;
  amountRequestedDisplay: string;
  amountApprovedDisplay: string;
  amountRequested: number;
  status: string;
  transactionId: string;
  remarks: string;
  bankSnapshot?: { bankHolder?: string; bankAccount?: string; bankIfsc?: string; bankName?: string };
};

function AdminPayouts() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Payout | null>(null);
  const [amountApproved, setAmountApproved] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-payouts", status],
    queryFn: () => api<{ payouts: Payout[] }>(`/api/admin/payouts${status ? `?status=${status}` : ""}`),
  });

  const process = useMutation({
    mutationFn: (action: string) =>
      api(`/api/admin/payouts/${selected!.id}/process`, {
        method: "POST",
        body: JSON.stringify({
          action,
          amountApproved: amountApproved ? Number(amountApproved) : undefined,
          transactionId,
          remarks,
        }),
      }),
    onSuccess: () => {
      toast.success("Payout updated");
      setSelected(null);
      qc.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportCsv = async () => {
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    const res = await fetch(`${base}/api/admin/payouts/export`, {
      headers: { Authorization: `Bearer ${getToken() || ""}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payouts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Vendor Payouts</h1>
          <p className="text-sm text-muted-foreground">Approve, reject, partial pay with UTR</p>
        </div>
        <Button type="button" variant="outline" className="gap-1" onClick={exportCsv}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <select className="mb-4 h-10 rounded-md border border-border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="partial">Partial</option>
        <option value="paid">Paid</option>
        <option value="rejected">Rejected</option>
      </select>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Requested</th>
              <th className="px-4 py-3 text-left">Approved</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">UTR</th>
              <th className="px-4 py-3 text-left" />
            </tr>
          </thead>
          <tbody>
            {(data?.payouts ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{p.vendor}</td>
                <td className="px-4 py-3">{p.amountRequestedDisplay}</td>
                <td className="px-4 py-3">{p.amountApprovedDisplay}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.transactionId || "—"}</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setSelected(p);
                      setAmountApproved(String(p.amountRequested || ""));
                      setTransactionId(p.transactionId || "");
                      setRemarks(p.remarks || "");
                    }}
                  >
                    Process
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process payout — {selected?.vendor}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Bank: {selected?.bankSnapshot?.bankHolder || "—"} · {selected?.bankSnapshot?.bankAccount || "—"} ·{" "}
              {selected?.bankSnapshot?.bankIfsc || "—"}
            </p>
            <div className="space-y-1">
              <Label>Amount approved</Label>
              <Input value={amountApproved} onChange={(e) => setAmountApproved(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>UTR / Transaction ID</Label>
              <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Remarks</Label>
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" type="button" onClick={() => process.mutate("approve")}>
                Approve
              </Button>
              <Button size="sm" variant="outline" type="button" onClick={() => process.mutate("partial")}>
                Partial
              </Button>
              <Button size="sm" type="button" onClick={() => process.mutate("paid")}>
                Mark paid
              </Button>
              <Button size="sm" variant="destructive" type="button" onClick={() => process.mutate("reject")}>
                Reject
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
