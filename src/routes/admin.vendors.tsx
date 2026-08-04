import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/vendors")({
  component: AdminVendors,
});

type VendorRow = {
  id: string;
  name: string;
  owner: string;
  email?: string;
  phone?: string;
  city: string;
  buses: number;
  pendingFleet?: number;
  documentsStatus?: string;
  walletBalance?: number;
  kyc: string;
  status: string;
  rawStatus: string;
};

function AdminVendors() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [walletNote, setWalletNote] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => api<{ vendors: VendorRow[] }>("/api/admin/vendors"),
  });

  const detailQ = useQuery({
    queryKey: ["admin-vendor-detail", selectedId],
    enabled: !!selectedId,
    queryFn: () => api<any>(`/api/admin/vendors/${selectedId}`),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) =>
      api(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, remark, rejectionReason }),
      }),
    onSuccess: () => {
      toast.success("Vendor updated");
      setRemark("");
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
      qc.invalidateQueries({ queryKey: ["admin-vendor-detail"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const docMut = useMutation({
    mutationFn: ({ docKey, status }: { docKey: string; status: string }) =>
      api(`/api/admin/vendors/${selectedId}/documents/${docKey}`, {
        method: "PATCH",
        body: JSON.stringify({ status, remark }),
      }),
    onSuccess: () => {
      toast.success("Document reviewed");
      qc.invalidateQueries({ queryKey: ["admin-vendor-detail"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const fleetMut = useMutation({
    mutationFn: ({ busId, status }: { busId: string; status: string }) =>
      api(`/api/admin/fleet/${busId}/review`, {
        method: "PATCH",
        body: JSON.stringify({ status, remark }),
      }),
    onSuccess: () => {
      toast.success("Fleet reviewed");
      qc.invalidateQueries({ queryKey: ["admin-vendor-detail"] });
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const walletMut = useMutation({
    mutationFn: () =>
      api(`/api/admin/vendors/${selectedId}/wallet`, {
        method: "POST",
        body: JSON.stringify({ type: "credit", amount: Number(walletAmount), note: walletNote }),
      }),
    onSuccess: () => {
      toast.success("Wallet credited");
      setWalletAmount("");
      setWalletNote("");
      qc.invalidateQueries({ queryKey: ["admin-vendor-detail"] });
      qc.invalidateQueries({ queryKey: ["admin-vendors"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remarkMut = useMutation({
    mutationFn: () =>
      api(`/api/admin/vendors/${selectedId}/remarks`, {
        method: "POST",
        body: JSON.stringify({ text: remark }),
      }),
    onSuccess: () => {
      toast.success("Remark added");
      setRemark("");
      qc.invalidateQueries({ queryKey: ["admin-vendor-detail"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={panelStatePadding}>Loading vendors…</div>;
  if (error) return <div className={`${panelStatePadding} text-destructive`}>{(error as Error).message}</div>;

  const vendors = data?.vendors || [];
  const detail = detailQ.data;
  const docs = detail?.vendor?.documents || {};

  return (
    <div className={panelPage}>
      <h1 className="text-2xl font-bold mb-1">Vendors</h1>
      <p className="text-sm text-muted-foreground mb-6">Approve, verify documents, fleet, and manage wallets</p>

      <div className="space-y-2">
        {vendors.map((v) => (
          <div key={v.id} className="border rounded-xl p-4 bg-card flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{v.name}</p>
              <p className="text-sm text-muted-foreground">
                {v.owner} · {v.city} · {v.email}
              </p>
              <p className="text-xs mt-1">
                {v.status} · Docs: {v.documentsStatus} · Fleet: {v.buses}
                {v.pendingFleet ? ` (${v.pendingFleet} pending)` : ""} · Wallet: ₹{v.walletBalance || 0}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {v.rawStatus === "pending" && (
                <>
                  <Button size="sm" onClick={() => statusMut.mutate({ id: v.id, status: "active" })}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => statusMut.mutate({ id: v.id, status: "rejected", rejectionReason: remark || "Rejected by admin" })}>Reject</Button>
                </>
              )}
              {v.rawStatus === "active" && (
                <Button size="sm" variant="outline" onClick={() => statusMut.mutate({ id: v.id, status: "suspended" })}>Suspend</Button>
              )}
              {v.rawStatus === "suspended" && (
                <Button size="sm" onClick={() => statusMut.mutate({ id: v.id, status: "active" })}>Reactivate</Button>
              )}
              <Button size="sm" variant="secondary" onClick={() => setSelectedId(v.id)}>Verify</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vendor verification — {detail?.vendor?.companyName || "…"}</DialogTitle>
          </DialogHeader>
          {detailQ.isLoading && <p>Loading…</p>}
          {detail && (
            <div className="space-y-6 text-sm">
              <div className="grid sm:grid-cols-2 gap-2">
                <p><span className="text-muted-foreground">Owner:</span> {detail.vendor.ownerName || detail.vendor.owner}</p>
                <p><span className="text-muted-foreground">Phone:</span> {detail.vendor.phone}</p>
                <p><span className="text-muted-foreground">Email:</span> {detail.vendor.email}</p>
                <p><span className="text-muted-foreground">GST/PAN:</span> {detail.vendor.gstNumber || "—"} / {detail.vendor.panNumber || "—"}</p>
                <p className="sm:col-span-2"><span className="text-muted-foreground">Address:</span> {detail.vendor.address}, {detail.vendor.city}, {detail.vendor.state} {detail.vendor.pin}</p>
                <p><span className="text-muted-foreground">Status:</span> {detail.vendor.status}</p>
                <p><span className="text-muted-foreground">Wallet:</span> ₹{detail.vendor.walletBalance || 0}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Documents</h3>
                <div className="space-y-2">
                  {["aadhar", "pan", "gst", "drivingLicense", "rc", "insurance", "businessProof", "cancelledCheque"].map((key) => {
                    const d = docs[key] || {};
                    return (
                      <div key={key} className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-2">
                        <div>
                          <p className="font-medium capitalize">{key}</p>
                          <p className="text-xs text-muted-foreground">{d.status || "missing"}</p>
                          {d.url ? <a href={d.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Open</a> : null}
                        </div>
                        {d.url && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => docMut.mutate({ docKey: key, status: "approved" })}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => docMut.mutate({ docKey: key, status: "rejected" })}>Reject</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Fleet</h3>
                <div className="space-y-2">
                  {(detail.fleet || []).map((b: any) => (
                    <div key={b.id || b._id} className="border rounded-lg p-2 flex flex-wrap justify-between gap-2">
                      <div>
                        <p className="font-medium">{b.busType} · {b.registrationNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {b.seats} seats · {b.approvalStatus} · ₹{b.pricingPerDay}/day
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => fleetMut.mutate({ busId: String(b.id || b._id), status: "approved" })}>Approve fleet</Button>
                        <Button size="sm" variant="destructive" onClick={() => fleetMut.mutate({ busId: String(b.id || b._id), status: "rejected" })}>Reject fleet</Button>
                      </div>
                    </div>
                  ))}
                  {!detail.fleet?.length && <p className="text-muted-foreground">No fleet added</p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Wallet credit</h3>
                <div className="flex flex-wrap gap-2">
                  <Input placeholder="Amount" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} className="w-32" />
                  <Input placeholder="Note" value={walletNote} onChange={(e) => setWalletNote(e.target.value)} className="flex-1" />
                  <Button onClick={() => walletMut.mutate()} disabled={!walletAmount}>Credit</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Remarks</h3>
                <div className="space-y-1 mb-2 max-h-32 overflow-y-auto">
                  {(detail.vendor.remarks || []).map((r: any, i: number) => (
                    <p key={i} className="text-xs border-l-2 pl-2">{r.text} — {r.byName}</p>
                  ))}
                </div>
                <Label>Admin remark / rejection reason</Label>
                <Textarea className="mt-1" value={remark} onChange={(e) => setRemark(e.target.value)} rows={2} />
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => remarkMut.mutate()} disabled={!remark}>Add remark</Button>
                  <Button onClick={() => statusMut.mutate({ id: selectedId!, status: "active" })}>Approve vendor</Button>
                  <Button variant="destructive" onClick={() => statusMut.mutate({ id: selectedId!, status: "rejected", rejectionReason: remark })}>Reject vendor</Button>
                  <Button variant="secondary" onClick={() => statusMut.mutate({ id: selectedId!, status: "suspended" })}>Suspend</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Transactions</h3>
                {(detail.transactions || []).slice(0, 8).map((t: any) => (
                  <p key={t._id} className="text-xs">{t.type} ₹{t.amount} — {t.note}</p>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
