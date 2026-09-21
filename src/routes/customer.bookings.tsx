import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, X, CreditCard, FileText, Ticket } from "lucide-react";
import { api } from "@/lib/api";
import { downloadAuthenticatedPdf } from "@/lib/download-pdf";
import { COMPANY } from "@/lib/company";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { RazorpayBookingPayButton } from "@/components/payments/RazorpayBookingPayButton";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/customer/bookings")({
  component: CustomerBookings,
});

type BookingRow = {
  id: string;
  bookingRef?: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  from: string;
  to: string;
  date: string;
  bus: string;
  vendor: string;
  status: string;
  rawStatus: string;
  amount: string;
  subtotal: string;
  gstAmount: string;
  totalWithGst: string;
  paymentType: string;
  advanceRequired: string;
  amountPaid: string;
  balanceDue: string;
  paymentStatus: string;
  gstRatePercent: number;
};

type Res = { bookings: BookingRow[] };

const useRazorpayRemote = Boolean(import.meta.env.VITE_API_URL?.trim());

function CustomerBookings() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: () => api<Res>("/api/customer/bookings"),
  });

  const cancelMut = useMutation({
    mutationFn: (id: string) => api("/api/customer/bookings/" + id + "/cancel", { method: "POST" }),
    onSuccess: () => {
      toast.success("Booking cancelled");
      qc.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payAdvanceMut = useMutation({
    mutationFn: (id: string) => api("/api/customer/bookings/" + id + "/pay-advance", { method: "POST" }),
    onSuccess: () => {
      toast.success("Advance payment recorded");
      qc.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payBalanceMut = useMutation({
    mutationFn: (id: string) => api("/api/customer/bookings/" + id + "/pay-balance", { method: "POST" }),
    onSuccess: () => {
      toast.success("Balance payment recorded");
      qc.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payFullMut = useMutation({
    mutationFn: (id: string) => api("/api/customer/bookings/" + id + "/pay-full", { method: "POST" }),
    onSuccess: () => {
      toast.success("Payment recorded — booking confirmed");
      qc.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statusColor: Record<string, string> = {
    Confirmed: "bg-chart-4/20 text-chart-4",
    "Pending payment": "bg-chart-5/20 text-chart-5",
    Pending: "bg-chart-5/20 text-chart-5",
    Completed: "bg-chart-2/20 text-chart-2",
    Cancelled: "bg-destructive/20 text-destructive",
    "On Trip": "bg-primary/20 text-primary",
  };

  async function downloadVoucher(b: BookingRow) {
    if (b.rawStatus === "awaiting_quotes") return;
    try {
      if (useRazorpayRemote) {
        await downloadAuthenticatedPdf(
          `/api/customer/vouchers/${b.id}/pdf`,
          `trip-voucher-${b.bookingRef || b.id.slice(-8)}.pdf`,
        );
        toast.success("Trip voucher downloaded");
      } else {
        const payload = {
          issuer: COMPANY.legalName,
          platform: COMPANY.platformBrand,
          bookingRef: b.bookingRef || b.id,
          route: `${b.from} → ${b.to}`,
          tripDate: b.date,
          operator: b.vendor,
          total: b.totalWithGst,
          amountPaid: b.amountPaid,
          status: b.status,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `trip-voucher-${b.id.slice(-8)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.message("Demo mode: voucher summary saved (connect API for PDF).");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download voucher");
    }
  }

  async function downloadInvoice(b: BookingRow) {
    if (!b.invoiceId) {
      toast.message("GST invoice is generated after payment is confirmed.");
      return;
    }
    try {
      if (useRazorpayRemote) {
        await downloadAuthenticatedPdf(
          `/api/customer/invoices/${b.invoiceId}/pdf`,
          `${b.invoiceNumber || "invoice"}.pdf`,
        );
        toast.success("GST invoice downloaded");
      } else {
        toast.message("Demo mode: invoice PDF requires VITE_API_URL to your backend.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download invoice");
    }
  }

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading bookings…</div>;
  if (error) {
    return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;
  }

  const bookings = data?.bookings ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">My Bookings</h1>
      <p className="text-muted-foreground text-sm mb-2">View and manage all your bus bookings</p>
      <p className="text-xs text-muted-foreground mb-6">
        Totals include GST where shown. Balance must be cleared before trip start.{" "}
        <Link to="/policies/refund-cancellation" className="text-primary hover:underline">
          Policy
        </Link>
        {useRazorpayRemote ? (
          <span className="block mt-2 text-chart-4">
            Online checkout uses Razorpay (configure <code className="rounded bg-muted px-1">RAZORPAY_*</code> on the API
            server).
          </span>
        ) : (
          <span className="block mt-2">
            Demo mode: payments record instantly. For Razorpay, set <code className="rounded bg-muted px-1">VITE_API_URL</code>{" "}
            to your mock API and add Razorpay keys there — see <code className="rounded bg-muted px-1">.env.example</code>.
          </span>
        )}
      </p>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground border rounded-xl p-8 text-center bg-card border-border">
          No bookings yet. Accept a quote from My Quotes to create one.
        </p>
      ) : (
        <>
        <div className="space-y-3 md:hidden">
          {bookings.map((b) => (
            <article key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-muted-foreground">#{b.id.slice(-8)}</p>
                  <p className="font-semibold text-foreground mt-1">{b.from} → {b.to}</p>
                  <p className="text-sm text-muted-foreground mt-1">{b.date} · {b.bus}</p>
                  <p className="text-sm text-foreground mt-1">{b.vendor}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] ?? "bg-muted"}`}>
                  {b.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div>
                  <p className="text-xs text-muted-foreground">Total (incl. GST)</p>
                  <p className="font-semibold text-foreground">{b.amount}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{b.paymentStatus}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap justify-end gap-1">
                    {b.rawStatus !== "cancelled" && b.paymentStatus === "Unpaid" && b.paymentType === "advance" && (
                      useRazorpayRemote ? (
                        <RazorpayBookingPayButton bookingId={b.id} purpose="advance">
                          Pay advance
                        </RazorpayBookingPayButton>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" type="button" disabled={payAdvanceMut.isPending} onClick={() => payAdvanceMut.mutate(b.id)}>
                          <CreditCard className="h-3 w-3" /> Advance
                        </Button>
                      )
                    )}
                    {b.rawStatus !== "cancelled" && b.paymentStatus === "Unpaid" && b.paymentType === "full" && (
                      useRazorpayRemote ? (
                        <RazorpayBookingPayButton bookingId={b.id} purpose="full">
                          Pay full
                        </RazorpayBookingPayButton>
                      ) : (
                        <Button variant="default" size="sm" className="h-8 gap-1 text-xs" type="button" disabled={payFullMut.isPending} onClick={() => payFullMut.mutate(b.id)}>
                          <CreditCard className="h-3 w-3" /> Pay full
                        </Button>
                      )
                    )}
                    {b.rawStatus !== "cancelled" && b.paymentStatus === "Partial" && (
                      useRazorpayRemote ? (
                        <RazorpayBookingPayButton bookingId={b.id} purpose="balance">
                          Pay balance
                        </RazorpayBookingPayButton>
                      ) : (
                        <Button variant="secondary" size="sm" className="h-8 gap-1 text-xs" type="button" disabled={payBalanceMut.isPending} onClick={() => payBalanceMut.mutate(b.id)}>
                          <CreditCard className="h-3 w-3" /> Balance
                        </Button>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" type="button"><Eye className="h-3.5 w-3.5" /> Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[min(100vw-2rem,32rem)]">
                        <DialogHeader><DialogTitle>Booking details</DialogTitle></DialogHeader>
                        <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(b, null, 2)}</pre>
                      </DialogContent>
                    </Dialog>
                    {b.rawStatus !== "awaiting_quotes" ? (
                      <>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" type="button" onClick={() => downloadVoucher(b)}>
                          <Ticket className="h-3.5 w-3.5" /> Voucher
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" type="button" onClick={() => downloadInvoice(b)}>
                          <FileText className="h-3.5 w-3.5" /> Invoice
                        </Button>
                      </>
                    ) : null}
                    {(b.status === "Pending payment" || b.status === "Confirmed" || b.status === "Pending") && (
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs text-destructive border-destructive/30" type="button" disabled={cancelMut.isPending} onClick={() => cancelMut.mutate(b.id)}>
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden md:block">
        <ResponsiveTable minWidth="800px">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">ID</th>
                <th className="text-left px-5 py-3 font-medium">Route</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Bus</th>
                <th className="text-left px-5 py-3 font-medium">Operator</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Total (incl. GST)</th>
                <th className="text-left px-5 py-3 font-medium">Pay</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{b.id.slice(-8)}</td>
                  <td className="px-5 py-3 text-foreground">{b.from} → {b.to}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                  <td className="px-5 py-3 text-muted-foreground">{b.bus}</td>
                  <td className="px-5 py-3 text-foreground">{b.vendor}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] ?? "bg-muted"}`}>{b.status}</span>
                    <div className="text-[10px] text-muted-foreground mt-1">{b.paymentStatus}</div>
                  </td>
                  <td className="px-5 py-3 font-medium text-foreground">{b.amount}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1">
                      {b.rawStatus !== "cancelled" && b.paymentStatus === "Unpaid" && b.paymentType === "advance" && (
                        useRazorpayRemote ? (
                          <RazorpayBookingPayButton bookingId={b.id} purpose="advance">
                            Pay advance (Razorpay)
                          </RazorpayBookingPayButton>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            type="button"
                            disabled={payAdvanceMut.isPending}
                            onClick={() => payAdvanceMut.mutate(b.id)}
                          >
                            <CreditCard className="h-3 w-3" /> Advance
                          </Button>
                        )
                      )}
                      {b.rawStatus !== "cancelled" && b.paymentStatus === "Unpaid" && b.paymentType === "full" && (
                        useRazorpayRemote ? (
                          <RazorpayBookingPayButton bookingId={b.id} purpose="full">
                            Pay full (Razorpay)
                          </RazorpayBookingPayButton>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            type="button"
                            disabled={payFullMut.isPending}
                            onClick={() => payFullMut.mutate(b.id)}
                          >
                            <CreditCard className="h-3 w-3" /> Pay full
                          </Button>
                        )
                      )}
                      {b.rawStatus !== "cancelled" && b.paymentStatus === "Partial" && (
                        useRazorpayRemote ? (
                          <RazorpayBookingPayButton bookingId={b.id} purpose="balance">
                            Pay balance (Razorpay)
                          </RazorpayBookingPayButton>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 gap-1 text-xs"
                            type="button"
                            disabled={payBalanceMut.isPending}
                            onClick={() => payBalanceMut.mutate(b.id)}
                          >
                            <CreditCard className="h-3 w-3" /> Balance
                          </Button>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" type="button"><Eye className="w-3.5 h-3.5" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Booking details</DialogTitle>
                          </DialogHeader>
                          <div className="text-xs space-y-2">
                            <pre className="bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(b, null, 2)}</pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {b.rawStatus !== "awaiting_quotes" ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            type="button"
                            title="Trip voucher PDF"
                            onClick={() => downloadVoucher(b)}
                          >
                            <Ticket className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            type="button"
                            title="GST invoice PDF"
                            onClick={() => downloadInvoice(b)}
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : null}
                      {(b.status === "Pending payment" || b.status === "Confirmed" || b.status === "Pending") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          type="button"
                          disabled={cancelMut.isPending}
                          onClick={() => cancelMut.mutate(b.id)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
        </div>
        </>
      )}
    </div>
  );
}
