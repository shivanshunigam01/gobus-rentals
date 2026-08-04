import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/companies")({
  component: AdminCompanies,
});

type Company = {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  gstin: string;
  status: string;
  creditLimit: number;
  walletBalance: number;
};

function AdminCompanies() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Company | null>(null);
  const [creditLimit, setCreditLimit] = useState("");
  const [discount, setDiscount] = useState("");
  const [remark, setRemark] = useState("");
  const [contractTitle, setContractTitle] = useState("Corporate Agreement");
  const [contractDiscount, setContractDiscount] = useState("5");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [q, status]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-companies", query],
    queryFn: () => api<{ companies: Company[] }>(`/api/admin/b2b/companies${query}`),
  });

  const detail = useQuery({
    queryKey: ["admin-company", selected?.id],
    queryFn: () => api<{ company: Company; contracts: unknown[]; invoices: unknown[] }>(`/api/admin/b2b/companies/${selected!.id}`),
    enabled: !!selected?.id,
  });

  const patch = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api(`/api/admin/b2b/companies/${selected!.id}`, { method: "PATCH", body: JSON.stringify(body) }),
    onSuccess: () => {
      toast.success("Company updated");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
      qc.invalidateQueries({ queryKey: ["admin-company", selected?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addContract = useMutation({
    mutationFn: () =>
      api(`/api/admin/b2b/companies/${selected!.id}/contracts`, {
        method: "POST",
        body: JSON.stringify({
          title: contractTitle,
          discountPercent: Number(contractDiscount) || 0,
          paymentTermsDays: 30,
          status: "active",
          pricingRules: [],
        }),
      }),
    onSuccess: () => {
      toast.success("Contract created");
      qc.invalidateQueries({ queryKey: ["admin-company", selected?.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">B2B Companies</h1>
      <p className="text-muted-foreground text-sm mb-6">Approve, suspend, set credit & contracts</p>

      <div className="mb-4 flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search name, email, GSTIN…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="h-10 rounded-md border border-border bg-background px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">GSTIN</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Credit</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.companies ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{c.companyName}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.email}
                  <br />
                  {c.phone}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{c.gstin || "—"}</td>
                <td className="px-4 py-3 capitalize">{c.status}</td>
                <td className="px-4 py-3">₹{Number(c.creditLimit || 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setSelected(c);
                      setCreditLimit(String(c.creditLimit || 0));
                      setDiscount("");
                      setRemark("");
                    }}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.companyName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Status: {detail.data?.company?.status || selected?.status}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" type="button" onClick={() => patch.mutate({ status: "active", remark: remark || "Approved" })}>
                Approve
              </Button>
              <Button size="sm" variant="outline" type="button" onClick={() => patch.mutate({ status: "suspended", remark })}>
                Suspend
              </Button>
              <Button size="sm" variant="destructive" type="button" onClick={() => patch.mutate({ status: "rejected", rejectionReason: remark || "Rejected" })}>
                Reject
              </Button>
            </div>
            <div className="space-y-1">
              <Label>Credit limit</Label>
              <div className="flex gap-2">
                <Input value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)} />
                <Button type="button" size="sm" onClick={() => patch.mutate({ creditLimit: Number(creditLimit) || 0 })}>
                  Save
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Default discount %</Label>
              <div className="flex gap-2">
                <Input value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 8" />
                <Button type="button" size="sm" onClick={() => patch.mutate({ defaultDiscountPercent: Number(discount) || 0 })}>
                  Save
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Remark</Label>
              <Input value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>
            <div className="rounded-lg border border-border p-3 space-y-2">
              <p className="font-medium">Add contract</p>
              <Input value={contractTitle} onChange={(e) => setContractTitle(e.target.value)} placeholder="Title" />
              <Input value={contractDiscount} onChange={(e) => setContractDiscount(e.target.value)} placeholder="Discount %" />
              <Button type="button" size="sm" disabled={addContract.isPending} onClick={() => addContract.mutate()}>
                Create contract
              </Button>
              <p className="text-xs text-muted-foreground">
                Existing contracts: {(detail.data?.contracts as unknown[] | undefined)?.length ?? 0}
              </p>
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
