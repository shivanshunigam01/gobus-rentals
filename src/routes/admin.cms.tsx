import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, HelpCircle, Bus, Tags, FolderOpen, Layers } from "lucide-react";
import { panelPage } from "@/lib/panel-page";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMSHub,
});

const links = [
  { to: "/admin/services", icon: Layers, label: "Services & Landings", desc: "Service, corporate, and industry pages" },
  { to: "/admin/blogs", icon: FileText, label: "Blog Posts", desc: "Articles, schedule, SEO" },
  { to: "/admin/blog-categories", icon: FolderOpen, label: "Blog Categories", desc: "Organize posts" },
  { to: "/admin/blog-tags", icon: Tags, label: "Blog Tags", desc: "Tag taxonomy" },
  { to: "/admin/vehicle-types", icon: Bus, label: "Vehicle Types", desc: "Fleet & booking catalog" },
  { to: "/admin/faqs", icon: HelpCircle, label: "Site FAQs", desc: "Homepage and general FAQs" },
];

function AdminCMSHub() {
  return (
    <div className={panelPage}>
      <h1 className="text-2xl font-bold mb-2">Content Hub</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Manage all marketing content. Changes publish to the live site via the public API.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors"
          >
            <l.icon className="w-6 h-6 mb-2 text-primary" />
            <p className="font-semibold">{l.label}</p>
            <p className="text-sm text-muted-foreground">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
