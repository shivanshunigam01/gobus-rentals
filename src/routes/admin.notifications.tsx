import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { panelPage } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/notifications")({
  component: AdminNotifications,
});

type Log = { id: string; channel: string; subject: string; body: string; audience: string; date: string };
type LogsRes = { logs: Log[] };

function AdminNotifications() {
  const qc = useQueryClient();
  const [channel, setChannel] = useState("email");
  const [audience, setAudience] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const logsQ = useQuery({
    queryKey: ["admin-notification-logs"],
    queryFn: () => api<LogsRes>("/api/admin/notification-logs"),
  });

  const sendMut = useMutation({
    mutationFn: () =>
      api("/api/admin/notifications", {
        method: "POST",
        body: JSON.stringify({ channel, subject, body, audience }),
      }),
    onSuccess: () => {
      toast.success("Notification logged for audit");
      setSubject("");
      setBody("");
      qc.invalidateQueries({ queryKey: ["admin-notification-logs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className={panelPage.md}>
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">Notifications</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Broadcast emails via SMTP. Recipients also get an in-app notification when they have an account. History logs every send for audit.
      </p>

      <Tabs defaultValue="send">
        <TabsList className="mb-6">
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <div className="bg-card rounded-xl border border-border p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMut.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Channel</Label>
                <Select value={channel} onValueChange={setChannel} disabled>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email (SMTP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recipients / audience</Label>
                <Input placeholder="e.g. All vendors, customer segment" value={audience} onChange={(e) => setAudience(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Notification subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Type your notification message..." rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
              <Button className="gap-2" type="submit" disabled={sendMut.isPending}><Send className="w-4 h-4" /> Send Notification</Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="bg-card rounded-xl border border-border">
            {logsQ.isLoading ? (
              <p className="p-5 text-sm text-muted-foreground">Loading…</p>
            ) : (logsQ.data?.logs ?? []).length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No logs yet.</p>
            ) : (
              logsQ.data!.logs.map((n) => (
                <div key={n.id} className="flex items-center justify-between px-5 py-4 border-b border-border last:border-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">{n.channel}</span>
                      <span className="text-sm font-medium text-foreground">→ {n.audience || "—"}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{n.subject}</p>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0 ml-4">{n.date}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
