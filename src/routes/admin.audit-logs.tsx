import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { panelPage, panelStatePadding } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/audit-logs")({
  component: AdminAuditLogs,
});

function AdminAuditLogs() {
  const [q, setQ] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["audit-logs", q],
    queryFn: () =>
      api<{ items: Array<Record<string, unknown>> }>(`/api/admin/audit-logs${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  });
  if (isLoading) return <div className={`${panelStatePadding} text-sm text-muted-foreground`}>Loading…</div>;
  if (error) return <div className={`${panelStatePadding} text-sm text-destructive`}>{(error as Error).message}</div>;

  return (
    <div className={panelPage.wide}>
      <h1 className="font-display text-2xl font-bold mb-1">Audit logs</h1>
      <p className="text-sm text-muted-foreground mb-4">Immutable admin & system action trail</p>
      <Input className="mb-4 max-w-md" placeholder="Search actions…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-4 py-3 text-left">When</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Actor</th>
              <th className="px-4 py-3 text-left">Entity</th>
              <th className="px-4 py-3 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((r) => (
              <tr key={String(r.id)} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {r.createdAt ? new Date(String(r.createdAt)).toLocaleString("en-IN") : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{String(r.action)}</td>
                <td className="px-4 py-3">
                  {String(r.actorEmail || r.actorRole || "system")}
                </td>
                <td className="px-4 py-3 text-xs">
                  {String(r.entityType || "")} {String(r.entityId || "").slice(-8)}
                </td>
                <td className="px-4 py-3">{String(r.message || "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
