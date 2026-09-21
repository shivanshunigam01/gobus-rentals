import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/vendor/bookings")({
  component: VendorBookings,
});

type Row = {
  id: string;
  customer: string;
  route: string;
  date: string;
  bus: string;
  amount: string;
  status: string;
  rawStatus?: string;
  payoutStatus?: string;
  commissionDeducted?: string;
  netPayout?: string;
};

type Res = { bookings: Row[] };

const displayToApi: Record<string, string> = {
  "Pending payment": "pending_payment",
  Confirmed: "confirmed",
  "On Trip": "on_trip",
  Completed: "completed",
  Cancelled: "cancelled",
};

const statusColor: Record<string, string> = {
  "Pending payment": "bg-chart-5/20 text-chart-5",
  Confirmed: "bg-chart-4/20 text-chart-4",
  "On Trip": "bg-primary/20 text-primary",
  Completed: "bg-chart-2/20 text-chart-2",
  Cancelled: "bg-destructive/20 text-destructive",
};

const statusOptions = ["Pending payment", "Confirmed", "On Trip", "Completed", "Cancelled"];

function VendorBookings() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-bookings"],
    queryFn: () => api<Res>("/api/vendor/bookings"),
  });

  const patchMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api("/api/vendor/bookings/" + id + "/status", {
        method: "PATCH",
        body: JSON.stringify({ status: displayToApi[status] }),
      }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["vendor-bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const bookings = data?.bookings ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Booking Management</h1>
      <p className="text-muted-foreground text-sm mb-6">Manage and update booking statuses</p>

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-border rounded-xl p-8 text-center bg-card">No bookings yet.</p>
      ) : (
        <ResponsiveTable minWidth="880px">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Booking ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Route</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Bus</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Payout</th>
                <th className="text-left px-5 py-3 font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const display = b.status;
                return (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{b.id.slice(-8)}</td>
                    <td className="px-5 py-3 text-foreground">{b.customer}</td>
                    <td className="px-5 py-3 text-foreground">{b.route}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.date}</td>
                    <td className="px-5 py-3 text-muted-foreground">{b.bus}</td>
                    <td className="px-5 py-3 font-medium text-primary">{b.amount}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[display] ?? "bg-muted"}`}>{display}</span></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {b.payoutStatus ? (
                        <>
                          <div className="font-medium text-foreground">{b.payoutStatus}</div>
                          <div>Comm {b.commissionDeducted ?? "—"}</div>
                          <div>Net {b.netPayout ?? "—"}</div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <Select
                        value={display}
                        onValueChange={(v) => patchMut.mutate({ id: b.id, status: v })}
                      >
                        <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ResponsiveTable>
      )}
    </div>
  );
}
