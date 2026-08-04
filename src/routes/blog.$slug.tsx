import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { buildPageMeta } from "@/lib/seo/buildMeta";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schemas";
import { fetchBlogBySlug, type BlogPost } from "@/lib/api/content";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SITE_URL } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Clock3, Share2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    try {
      return await fetchBlogBySlug(params.slug);
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const post = loaderData as BlogPost | undefined;
    if (!post) return {};
    const path = post.canonicalPath || `/blog/${post.slug}`;
    const description = post.metaDescription || post.excerpt || post.title;
    const { meta, links } = buildPageMeta({
      title: post.metaTitle || post.title,
      description,
      path,
      keywords: (post.keywords || []).join(", "),
      ogImage: post.ogImage || post.featuredImage?.url,
      ogType: "article",
      noindex: post.robots?.includes("noindex"),
    });
    return {
      meta: [
        ...meta,
        {
          "script:ld+json": articleSchema({
            title: post.title,
            description,
            path,
            datePublished: post.publishedAt || new Date().toISOString(),
            image: post.featuredImage?.url,
          }),
        },
        {
          "script:ld+json": breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path },
          ]),
        },
      ],
      links,
    };
  },
  component: BlogArticle,
});

function BlogArticle() {
  const post = Route.useLoaderData();
  const shareUrl = `${SITE_URL}/blog/${post.slug}`;
  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: shareUrl }).catch(() => null);
      return;
    }
    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">{post.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-6">
            <span>{post.author?.name || "Kartar Travels"}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" /> {post.readTimeMinutes || 5} min read
            </span>
            {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString("en-IN")}</span> : null}
          </div>
          {post.featuredImage?.url ? (
            <img
              src={cloudinaryUrl(post.featuredImage.url, { width: 1200 })}
              alt={post.featuredImage.alt || post.title}
              width={1200}
              height={630}
              className="w-full rounded-xl mb-8 aspect-video object-cover bg-muted"
              loading="eager"
            />
          ) : null}
          <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line mb-10">
            {post.content}
          </div>

          {(post.gallery || []).length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {post.gallery!.map((g, i) => (
                <img
                  key={i}
                  src={cloudinaryUrl(g.url, { width: 800 })}
                  alt={g.alt || ""}
                  loading="lazy"
                  className="rounded-lg aspect-video object-cover bg-muted"
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {(post.categoryIds || []).map((c) => (
              <Link
                key={c.slug}
                to="/blog"
                search={{ category: c.slug } as never}
                className="text-xs border rounded-full px-2 py-1"
              >
                {c.name}
              </Link>
            ))}
            {(post.tagIds || []).map((t) => (
              <span key={t.slug} className="text-xs text-muted-foreground">
                #{t.name}
              </span>
            ))}
          </div>

          <Button type="button" variant="outline" className="gap-2 mb-12" onClick={() => void share()}>
            <Share2 className="w-4 h-4" /> Share
          </Button>

          {(post.related || []).length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-semibold mb-4">Related blogs</h2>
              <div className="space-y-3">
                {post.related!.map((r) => (
                  <Link
                    key={r.slug}
                    to="/blog/$slug"
                    params={{ slug: r.slug }}
                    className="block border rounded-lg p-4 hover:border-primary"
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
