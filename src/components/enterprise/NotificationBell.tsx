import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth-storage";

type NotifRes = {
  unreadCount: number;
  notifications: Array<{ id: string; title: string; body: string; read: boolean; createdAt?: string }>;
};

export function NotificationBell({ basePath = "/api/enterprise" }: { basePath?: string }) {
  const qc = useQueryClient();
  const enabled = Boolean(getToken());
  const listPath = `${basePath}/notifications`;
  const { data } = useQuery({
    queryKey: ["notifications", listPath],
    queryFn: () => api<NotifRes>(listPath),
    enabled,
    refetchInterval: 60_000,
  });
  const markAll = useMutation({
    mutationFn: () => api(`${basePath}/notifications/read-all`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const unread = data?.unreadCount ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-sm font-medium">Notifications</p>
          <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => markAll.mutate()}>
            Mark all read
          </Button>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {(data?.notifications ?? []).length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications</li>
          ) : (
            data!.notifications.map((n) => (
              <li key={n.id} className={`border-b border-border px-3 py-2 text-sm last:border-0 ${n.read ? "opacity-70" : ""}`}>
                <p className="font-medium">{n.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
