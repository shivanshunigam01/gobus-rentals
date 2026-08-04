import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { COMPANY } from "@/lib/company";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarDays, Clock3, Search } from "lucide-react";
import { api } from "@/lib/api";
import { fetchBlogs, type BlogPost } from "@/lib/api/content";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => {
    const { meta, links } = buildPageMeta({
      title: `Bus Rental Blog India | ${COMPANY.platformBrand}`,
      description: `Guides on corporate bus rental, employee transport, Urbania, pricing, and fleet decisions — ${COMPANY.legalName}.`,
      path: "/blog",
      keywords:
        "bus rental blog India, corporate bus hire guide, employee transportation tips, Urbania rental, bus contract pricing",
    });
    return { meta, links };
  },
});

function BlogIndex() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");

  const catsQ = useQuery({
    queryKey: ["public-blog-categories"],
    queryFn: () => api<{ items: { name: string; slug: string }[] }>("/api/public/blog-categories"),
  });
  const tagsQ = useQuery({
    queryKey: ["public-blog-tags"],
    queryFn: () => api<{ items: { name: string; slug: string }[] }>("/api/public/blog-tags"),
  });
  const blogsQ = useQuery({
    queryKey: ["public-blogs", q, category, tag],
    queryFn: () => fetchBlogs({ q: q || undefined, category: category || undefined, tag: tag || undefined }),
  });

  const recent = useMemo(() => (blogsQ.data?.items || []).slice(0, 5), [blogsQ.data]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Corporate transport & bus rental blog</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Practical guides for companies and travellers — curated by {COMPANY.legalName}.
          </p>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search articles…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`text-xs px-2 py-1 rounded border ${!category ? "bg-primary text-primary-foreground" : ""}`}
                  onClick={() => setCategory("")}
                >
                  All categories
                </button>
                {(catsQ.data?.items || []).map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className={`text-xs px-2 py-1 rounded border ${category === c.slug ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setCategory(c.slug)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(tagsQ.data?.items || []).map((t) => (
                  <button
                    key={t.slug}
                    type="button"
                    className={`text-xs px-2 py-1 rounded-full border ${tag === t.slug ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setTag(tag === t.slug ? "" : t.slug)}
                  >
                    #{t.name}
                  </button>
                ))}
              </div>

              {blogsQ.isLoading && <p>Loading…</p>}
              <div className="space-y-4">
                {(blogsQ.data?.items || []).map((post: BlogPost) => (
                  <Link
                    key={post.slug}
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="block border rounded-xl p-5 hover:border-primary transition-colors bg-card"
                  >
                    <div className="flex gap-4">
                      {post.featuredImage?.url ? (
                        <img
                          src={cloudinaryUrl(post.featuredImage.url, { width: 240 })}
                          alt=""
                          width={120}
                          height={80}
                          className="hidden sm:block w-28 h-20 object-cover rounded-md bg-muted"
                          loading="lazy"
                        />
                      ) : null}
                      <div>
                        <h2 className="font-semibold text-lg mb-1">{post.title}</h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="w-3 h-3" /> {post.readTimeMinutes || 5} min
                          </span>
                          {post.publishedAt ? (
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString("en-IN")}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="lg:w-72 space-y-4">
              <div className="border rounded-xl p-4 bg-card">
                <h3 className="font-semibold mb-3">Recent blogs</h3>
                <ul className="space-y-2">
                  {recent.map((p) => (
                    <li key={p.slug}>
                      <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-sm hover:text-primary">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Badge variant="secondary">Updated 2026</Badge>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
