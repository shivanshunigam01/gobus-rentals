import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/vendor/drivers")({
  component: VendorDrivers,
});

function VendorDrivers() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", licenseNumber: "", email: "" });
  const { data, isLoading, error } = useQuery({
    queryKey: ["vendor-drivers"],
    queryFn: () => api<{ items: Array<Record<string, string>> }>("/api/vendor/drivers"),
  });
  const create = useMutation({
    mutationFn: () => api("/api/vendor/drivers", { method: "POST", body: JSON.stringify(form) }),
    onSuccess: () => {
      toast.success("Driver added");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["vendor-drivers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Drivers</h1>
          <p className="text-sm text-muted-foreground">Manage drivers and assign to trips from bookings</p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Add driver
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">License</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3">{d.phone}</td>
                <td className="px-4 py-3">{d.licenseNumber || "—"}</td>
                <td className="px-4 py-3 capitalize">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(["name", "phone", "licenseNumber", "email"] as const).map((k) => (
              <div key={k} className="space-y-1">
                <Label className="capitalize">{k}</Label>
                <Input value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" disabled={create.isPending || !form.name || !form.phone} onClick={() => create.mutate()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
