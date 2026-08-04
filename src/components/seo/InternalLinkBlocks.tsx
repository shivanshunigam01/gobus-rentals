type LinkItem = { href: string; anchor: string; cluster?: string };

type Props = {
  links?: {
    relatedCities?: LinkItem[];
    nearbyCities?: LinkItem[];
    relatedVehicles?: LinkItem[];
    relatedIndustries?: LinkItem[];
    relatedBlogs?: LinkItem[];
    relatedServices?: LinkItem[];
    relatedFaqs?: LinkItem[];
    popularSearches?: LinkItem[];
    latestBlogs?: LinkItem[];
    mostBookedVehicles?: LinkItem[];
    topRoutes?: LinkItem[];
    trendingCities?: LinkItem[];
  } | null;
};

function Block({ title, items }: { title: string; items?: LinkItem[] }) {
  if (!items?.length) return null;
  return (
    <section className="mb-8">
      <h2 className="font-display text-xl font-semibold mb-3">{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.slice(0, 12).map((l) => (
          <li key={`${title}-${l.href}-${l.anchor}`}>
            <a
              href={l.href}
              className="inline-block rounded-full border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              {l.anchor}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function InternalLinkBlocks({ links }: Props) {
  if (!links) return null;
  return (
    <div className="mt-12 border-t pt-10">
      <h2 className="font-display text-2xl font-semibold mb-6">Explore related pages</h2>
      <Block title="Related Cities" items={links.relatedCities} />
      <Block title="Nearby Cities" items={links.nearbyCities} />
      <Block title="Trending Cities" items={links.trendingCities} />
      <Block title="Related Vehicles" items={links.relatedVehicles} />
      <Block title="Most Booked Vehicles" items={links.mostBookedVehicles} />
      <Block title="Related Industries" items={links.relatedIndustries} />
      <Block title="Related Services" items={links.relatedServices} />
      <Block title="Top Routes" items={links.topRoutes} />
      <Block title="Related Blogs" items={links.relatedBlogs} />
      <Block title="Latest Blogs" items={links.latestBlogs} />
      <Block title="Popular Searches" items={links.popularSearches} />
      <Block title="Related FAQs" items={links.relatedFaqs} />
    </div>
  );
}
