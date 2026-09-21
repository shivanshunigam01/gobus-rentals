import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Eye, MessageSquareQuote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/leads")({
  component: VendorLeads,
});

type LeadRow = {
  id: string;
  customer: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  bus: string;
  purpose: string;
  status: string;
};

type Res = { leads: LeadRow[]; notice?: string };

function VendorLeads() {
  const qc = useQueryClient();
  const [quoteLead, setQuoteLead] = useState<LeadRow | null>(null);
  const [viewLead, setViewLead] = useState<LeadRow | null>(null);
  const [amount, setAmount] = useState("");
  const [inclusions, setInclusions] = useState("Driver, toll, parking");
  const [terms, setTerms] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-leads"],
    queryFn: () => api<Res>("/api/vendor/leads"),
  });

  const rejectMut = useMutation({
    mutationFn: (id: string) => api("/api/vendor/leads/" + id + "/reject", { method: "POST" }),
    onSuccess: () => {
      toast.message("Lead rejected");
      qc.invalidateQueries({ queryKey: ["vendor-leads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const quoteMut = useMutation({
    mutationFn: () =>
      api("/api/vendor/quotes", {
        method: "POST",
        body: JSON.stringify({
          leadId: quoteLead!.id,
          amount: Number(amount),
          inclusions,
          terms,
        }),
      }),
    onSuccess: () => {
      toast.success("Quote submitted. The customer will be emailed when your quote is sent.");
      setQuoteLead(null);
      setAmount("");
      qc.invalidateQueries({ queryKey: ["vendor-leads"] });
      qc.invalidateQueries({ queryKey: ["vendor-quotes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusColor: Record<string, string> = {
    Open: "bg-primary/20 text-primary",
    New: "bg-primary/20 text-primary",
    Quoted: "bg-chart-4/20 text-chart-4",
    Accepted: "bg-chart-2/20 text-chart-2",
    Rejected: "bg-destructive/20 text-destructive",
  };

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading leads…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const leads = data?.leads ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Lead Management</h1>
      <p className="text-muted-foreground text-sm mb-2">View and respond to customer booking requests</p>
      {data?.notice ? <p className="text-sm text-chart-5 mb-4">{data.notice}</p> : null}

      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-border rounded-xl p-8 text-center bg-card">
          No open leads. When customers submit requirements, they appear here (requires active vendor account).
        </p>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <div key={l.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{l.customer}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[l.status] ?? "bg-muted"}`}>{l.status}</span>
                  </div>
                  <p className="text-sm text-foreground">{l.from} → {l.to}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span>📅 {l.date}</span>
                    <span>👥 {l.passengers} passengers</span>
                    <span>🚌 {l.bus}</span>
                    <span>🎯 {l.purpose}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="gap-1" type="button" onClick={() => setViewLead(l)}><Eye className="w-3.5 h-3.5" /> View</Button>
                  {(l.status === "New" || l.status === "Open") && (
                    <>
                      <Button size="sm" className="gap-1" type="button" onClick={() => setQuoteLead(l)}><MessageSquareQuote className="w-3.5 h-3.5" /> Send Quote</Button>
                      <Button variant="outline" size="sm" className="gap-1 text-destructive" type="button" disabled={rejectMut.isPending} onClick={() => rejectMut.mutate(l.id)}><X className="w-3.5 h-3.5" /> Reject</Button>
                    </>
                  )}
                  {l.status === "Quoted" && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Check className="w-3.5 h-3.5 text-chart-2" /> Quote sent</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!viewLead} onOpenChange={(o) => !o && setViewLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead details</DialogTitle>
          </DialogHeader>
          {viewLead ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Lead ID</p>
                <p className="font-mono text-sm text-foreground">{viewLead.id}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium text-foreground">{viewLead.customer || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground">{viewLead.status || "New"}</p>
                </div>
                <div className="rounded-lg border border-border p-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="text-sm font-medium text-foreground">{viewLead.from} → {viewLead.to}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Journey Date</p>
                  <p className="text-sm text-foreground">{viewLead.date || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Passengers</p>
                  <p className="text-sm text-foreground">{viewLead.passengers || 0}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Bus Type</p>
                  <p className="text-sm text-foreground">{viewLead.bus || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs text-muted-foreground">Purpose</p>
                  <p className="text-sm text-foreground">{viewLead.purpose || "—"}</p>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={!!quoteLead} onOpenChange={(o) => !o && setQuoteLead(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Total price (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Inclusions</Label>
              <Input value={inclusions} onChange={(e) => setInclusions(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Terms / notes</Label>
              <Textarea rows={3} value={terms} onChange={(e) => setTerms(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setQuoteLead(null)}>Cancel</Button>
            <Button type="button" disabled={quoteMut.isPending || !amount} onClick={() => quoteMut.mutate()}>Submit quote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
