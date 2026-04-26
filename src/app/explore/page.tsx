import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategoriesFromDb, getCitiesFromDb, listPublishedAdsFromDb } from "@/lib/supabase/queries";
import { rankScore } from "@/lib/domain/ranking";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const city = typeof sp.city === "string" ? sp.city : "";
  const sort = sp.sort === "newest" ? "newest" : "rank";
  const page = Number(typeof sp.page === "string" ? sp.page : "1") || 1;

  let data;
  try {
    data = await listPublishedAdsFromDb({ query, category, city, sort, page, pageSize: 9 });
  } catch {
    data = { items: [], meta: { total: 0, totalPages: 1, page: 1, pageSize: 9 } };
  }

  const categories = await getCategoriesFromDb().catch(() => []);
  const cities = await getCitiesFromDb().catch(() => []);

  const prevPage = Math.max(1, data.meta.page - 1);
  const nextPage = Math.min(data.meta.totalPages, data.meta.page + 1);

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Explore Ads</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Search, filter by category/city, sort by rank, and browse active listings only.
            </p>
          </div>
          <form className="flex w-full gap-2 md:w-[420px]">
            <Input placeholder="Search title, seller, keywords…" name="q" defaultValue={query} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="sort" value={sort} />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary">Active only</Badge>
          <Badge variant="outline">Category: {category || "all"}</Badge>
          <Badge variant="outline">City: {city || "all"}</Badge>
          <Badge variant="outline">Sort: {sort}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/explore">
            <Badge variant={!category ? "default" : "outline"}>All categories</Badge>
          </Link>
          {categories.map((c) => (
            <Link key={c} href={`/explore?category=${c}&city=${city}&q=${query}&sort=${sort}`}>
              <Badge variant={category === c ? "default" : "outline"}>{c}</Badge>
            </Link>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/explore">
            <Badge variant={!city ? "default" : "outline"}>All cities</Badge>
          </Link>
          {cities.map((c) => (
            <Link key={c} href={`/explore?category=${category}&city=${c}&q=${query}&sort=${sort}`}>
              <Badge variant={city === c ? "default" : "outline"}>{c}</Badge>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {data.items.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <img
                className="aspect-[16/10] w-full object-cover"
                src={ad.media.thumbnailUrl}
                alt={ad.title}
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold leading-tight">{ad.title}</p>
                  <Badge variant={ad.featured ? "default" : "secondary"}>
                    {ad.featured ? "Featured" : ad.package}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {ad.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/ads/${ad.slug}`}>View</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {ad.city} • {ad.category}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {data.items.length === 0 ? (
          <Card className="mt-6 p-8 text-center">
            <p className="font-semibold">No active ads found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing filters or broadening your search keywords.
            </p>
          </Card>
        ) : null}

        <div className="mt-10 flex items-center justify-center gap-2">
          <Button asChild variant="outline" disabled={data.meta.page <= 1}>
            <Link href={`/explore?page=${prevPage}&q=${query}&category=${category}&city=${city}&sort=${sort}`}>
              Prev
            </Link>
          </Button>
          <Badge variant="secondary">
            Page {data.meta.page} / {data.meta.totalPages}
          </Badge>
          <Button asChild variant="outline" disabled={data.meta.page >= data.meta.totalPages}>
            <Link href={`/explore?page=${nextPage}&q=${query}&category=${category}&city=${city}&sort=${sort}`}>
              Next
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

