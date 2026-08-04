import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getToken, getStoredUser } from "@/lib/auth-storage";

type SearchRes = {
  groups: Array<{
    type: string;
    label: string;
    items: Array<{ id: string; title: string; subtitle?: string; href?: string }>;
  }>;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const user = getStoredUser();
  const canSearch = Boolean(getToken() && user?.role === "admin");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (canSearch) setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canSearch]);

  const { data, isFetching } = useQuery({
    queryKey: ["global-search", q],
    queryFn: () => api<SearchRes>(`/api/admin/search?q=${encodeURIComponent(q)}`),
    enabled: canSearch && open && q.trim().length >= 2,
  });

  if (!canSearch) return null;

  return (
    <>
      <Button type="button" variant="outline" size="sm" className="gap-2 text-muted-foreground" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 text-[10px] sm:inline">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search bookings, vendors, leads…" value={q} onValueChange={setQ} />
        <CommandList>
          <CommandEmpty>{isFetching ? "Searching…" : "No results"}</CommandEmpty>
          {(data?.groups ?? []).map((g) => (
            <CommandGroup key={g.type} heading={g.label}>
              {g.items.map((item) => (
                <CommandItem
                  key={`${g.type}-${item.id}`}
                  value={`${item.title} ${item.subtitle || ""}`}
                  onSelect={() => {
                    setOpen(false);
                    if (item.href) navigate({ to: item.href as "/" });
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    {item.subtitle ? <p className="text-xs text-muted-foreground">{item.subtitle}</p> : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
