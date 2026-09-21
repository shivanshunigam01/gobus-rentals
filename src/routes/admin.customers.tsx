import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, Ban, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";
import { ResponsiveTable } from "@/components/ui/responsive-table";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

type C = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  joined: string;
  status: string;
  blocked: boolean;
};

type Res = { users: C[] };

function AdminCustomers() {
  const qc = useQueryClient();
  const [view, setView] = useState<C | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api<Res>("/api/admin/users"),
  });

  const blockMut = useMutation({
    mutationFn: ({ id, blocked }: { id: string; blocked: boolean }) =>
      api("/api/admin/users/" + id, { method: "PATCH", body: JSON.stringify({ blocked }) }),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  const customers = data?.users ?? [];

  return (
    <div className={panelPage.standard}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Customer Management</h1>
      <p className="text-muted-foreground text-sm mb-6">
        View and manage customer accounts (block/unblock). Operators are under{" "}
        <Link to="/admin/vendors" className="text-primary font-medium underline-offset-4 hover:underline">
          Vendors
        </Link>
        .
      </p>

      <ResponsiveTable minWidth="720px">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-3 font-medium">ID</th>
              <th className="text-left px-5 py-3 font-medium">Name</th>
              <th className="text-left px-5 py-3 font-medium">Email</th>
              <th className="text-left px-5 py-3 font-medium">Phone</th>
              <th className="text-left px-5 py-3 font-medium">Bookings</th>
              <th className="text-left px-5 py-3 font-medium">Joined</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-5 py-3 font-medium text-foreground font-mono text-xs">{c.id.slice(-8)}</td>
                <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-5 py-3 text-muted-foreground tabular-nums">{c.bookings}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.joined}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === "Active" ? "bg-chart-2/20 text-chart-2" : "bg-destructive/20 text-destructive"}`}>{c.status}</span></td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" type="button" onClick={() => setView(c)}><Eye className="w-3.5 h-3.5" /></Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      type="button"
                      onClick={() => {
                        window.location.href = `mailto:${c.email}`;
                      }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      type="button"
                      disabled={blockMut.isPending}
                      onClick={() => blockMut.mutate({ id: c.id, blocked: !c.blocked })}
                      title={c.blocked ? "Unblock" : "Block"}
                    >
                      <Ban className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTable>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer</DialogTitle>
          </DialogHeader>
          {view ? <pre className="text-xs bg-muted p-3 rounded-md overflow-auto">{JSON.stringify(view, null, 2)}</pre> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
