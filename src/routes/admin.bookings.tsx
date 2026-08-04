import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Lock, Unlock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

type B = {
  id: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  vendor: string;
  company?: string | null;
  vehicle?: string;
  route: string;
  amount: string;
  gstAmount: string;
  paymentType: string;
  paymentStatus: string;
  status: string;
  date: string;
  payoutStatus: string;
  vendorPayout: string;
};

type Detail = {
  booking: Record<string, unknown>;
  lead: Record<string, unknown>;
  customer: { name?: string; email?: string; phone?: string } | null;
  vendor: { companyName?: string; phone?: string; email?: string } | null;
  company: { companyName?: string; gstin?: string } | null;
  bus: { name?: string; registrationNumber?: string } | null;
  payments: Array<{ id: string; amount: number; status: string; purpose: string; createdAt?: string }>;
  events: Array<{ id: string; type: string; message: string; createdAt?: string }>;
  driver?: { name?: string; phone?: string };
};

const displayOpts = [
  { v: "pending_payment", l: "Pending payment" },
  { v: "confirmed", l: "Confirmed" },
  { v: "on_trip", l: "On Trip" },
  { v: "completed", l: "Completed" },
  { v: "cancelled", l: "Cancelled" },
];

const statusColor: Record<string, string> = {
  confirmed: "bg-chart-4/20 text-chart-4",
  on_trip: "bg-primary/20 text-primary",
  completed: "bg-chart-2/20 text-chart-2",
  cancelled: "bg-destructive/20 text-destructive",
  pending_payment: "bg-chart-5/20 text-chart-5",
};

function label(s: string) {
  return displayOpts.find((o) => o.v === s)?.l ?? s;
}

function AdminBookings() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [viewId, setViewId] = useState<string | null>(null);

  const queryStr = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (paymentStatus) p.set("paymentStatus", paymentStatus);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [q, status, paymentStatus, from, to]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-bookings", queryStr],
    queryFn: () => api<{ bookings: B[] }>(`/api/admin/bookings${queryStr}`),
  });

  const detailQ = useQuery({
    queryKey: ["admin-booking-detail", viewId],
    queryFn: () => api<Detail>(`/api/admin/bookings/${viewId}`),
    enabled: !!viewId,
  });

  const patchMut = useMutation({
    mutationFn: ({ id, status: st }: { id: string; status: string }) =>
      api("/api/admin/bookings/" + id, { method: "PATCH", body: JSON.stringify({ status: st }) }),
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      if (viewId) qc.invalidateQueries({ queryKey: ["admin-booking-detail", viewId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payoutMut = useMutation({
    mutationFn: ({ id, action }: { id: string; action: "hold" | "release" }) =>
      api("/api/admin/bookings/" + id + "/payout-override", {
        method: "POST",
        body: JSON.stringify({ action }),
      }),
    onSuccess: () => {
      toast.success("Payout override saved");
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const bookings = data?.bookings ?? [];
  const detail = detailQ.data;

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">All Bookings</h1>
      <p className="text-muted-foreground text-sm mb-4">Search, filter, timeline & payout controls</p>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Input placeholder="Booking ID, phone, email, vehicle…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="h-10 rounded-md border border-border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {displayOpts.map((o) => (
            <option key={o.v} value={o.v}>
              {o.l}
            </option>
          ))}
        </select>
        <select className="h-10 rounded-md border border-border bg-background px-3 text-sm" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          <option value="">All payments</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="unpaid">Unpaid</option>
        </select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">ID</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Vendor / Co.</th>
              <th className="text-left px-4 py-3 font-medium">Route</th>
              <th className="text-left px-4 py-3 font-medium">Total</th>
              <th className="text-left px-4 py-3 font-medium">Pay</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Payout</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium text-foreground font-mono text-xs">{b.id.slice(-8)}</td>
                <td className="px-4 py-3">
                  <div>{b.customer}</div>
                  <div className="text-[10px] text-muted-foreground">{b.customerPhone || b.customerEmail}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{b.vendor}</div>
                  {b.company ? <div className="text-[10px] text-muted-foreground">{b.company}</div> : null}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.route}
                  {b.vehicle ? <div className="text-[10px]">{b.vehicle}</div> : null}
                </td>
                <td className="px-4 py-3 font-medium">
                  {b.amount}
                  <div className="text-[10px] text-muted-foreground">GST {b.gstAmount}</div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {b.paymentType} · {b.paymentStatus}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] ?? "bg-muted"}`}>
                    {label(b.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="font-medium">{b.payoutStatus}</div>
                  <div className="text-muted-foreground">Net {b.vendorPayout}</div>
                  {b.status === "completed" ? (
                    <div className="flex gap-1 mt-1">
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-1" type="button" onClick={() => payoutMut.mutate({ id: b.id, action: "hold" })}>
                        <Lock className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-1" type="button" onClick={() => payoutMut.mutate({ id: b.id, action: "release" })}>
                        <Unlock className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(v) => patchMut.mutate({ id: b.id, status: v })}>
                      <SelectTrigger className="h-8 w-[130px] text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {displayOpts.map((o) => (
                          <SelectItem key={o.v} value={o.v}>
                            {o.l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" type="button" onClick={() => setViewId(b.id)}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewId} onOpenChange={(o) => !o && setViewId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking detail {viewId ? `· ${viewId.slice(-8)}` : ""}</DialogTitle>
          </DialogHeader>
          {detailQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : detail ? (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Customer</p>
                  <p className="font-medium">{detail.customer?.name || "—"}</p>
                  <p className="text-muted-foreground">{detail.customer?.email}</p>
                  <p className="text-muted-foreground">{detail.customer?.phone}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Vendor</p>
                  <p className="font-medium">{detail.vendor?.companyName || "—"}</p>
                  <p className="text-muted-foreground">{detail.vendor?.email}</p>
                  <p className="text-muted-foreground">{detail.vendor?.phone}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Company / Driver</p>
                  <p>{detail.company?.companyName || "Retail"}</p>
                  <p className="text-muted-foreground">
                    Driver: {(detail.booking.driver as { name?: string } | undefined)?.name || "—"}{" "}
                    {(detail.booking.driver as { phone?: string } | undefined)?.phone || ""}
                  </p>
                  <p className="text-muted-foreground">Bus: {detail.bus?.name || detail.bus?.registrationNumber || "—"}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Trip</p>
                  <p>
                    {String(detail.lead?.pickup || "")} → {String(detail.lead?.drop || "")}
                  </p>
                  <p className="text-muted-foreground">
                    {String(detail.lead?.journeyDate || "")} {String(detail.lead?.journeyTime || "")}
                  </p>
                  <p>
                    Status: {String(detail.booking.displayStatus || detail.booking.rawStatus)} · Pay{" "}
                    {String(detail.booking.paymentStatus)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Payment logs</p>
                <ul className="space-y-1">
                  {(detail.payments || []).length === 0 ? (
                    <li className="text-muted-foreground">No payments</li>
                  ) : (
                    detail.payments.map((p) => (
                      <li key={p.id} className="rounded border border-border px-3 py-2 text-xs">
                        ₹{p.amount} · {p.purpose} · {p.status}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Timeline</p>
                <ol className="relative space-y-3 border-l border-border pl-4">
                  {(detail.events || []).length === 0 ? (
                    <li className="text-muted-foreground">No events yet</li>
                  ) : (
                    detail.events.map((e) => (
                      <li key={e.id}>
                        <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-primary" />
                        <p className="font-medium">{e.message}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {e.type}
                          {e.createdAt ? ` · ${new Date(e.createdAt).toLocaleString("en-IN")}` : ""}
                        </p>
                      </li>
                    ))
                  )}
                </ol>
              </div>
            </div>
          ) : (
            <p className="text-sm text-destructive">Failed to load detail</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
