import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listPublishedAdsFromDb } from "@/lib/supabase/queries";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let items: any[] = [];
  try {
    const data = await listPublishedAdsFromDb({ category: slug, page: 1, pageSize: 12 });
    items = data.items;
  } catch {}
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Category: <span className="capitalize">{slug.replaceAll("-", " ")}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Showing active-only ads in this category.
            </p>
          </div>
          <Badge variant="secondary">Active only</Badge>
        </div>

        {items.length === 0 ? (
          <Card className="mt-8 p-8 text-center">
            <p className="font-semibold">No listings in this category yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first listing from client dashboard. Meanwhile, explore other active categories.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button asChild variant="outline">
                <Link href="/explore">Explore ads</Link>
              </Button>
              <Button asChild>
                <Link href="/client/ads/new">Create ad</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {items.map((ad) => (
              <Card key={ad.id} className="overflow-hidden">
                <img className="aspect-[16/10] w-full object-cover" src={ad.media.thumbnailUrl} alt={ad.title} />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold leading-tight">{ad.title}</p>
                    <Badge variant={ad.featured ? "default" : "secondary"}>
                      {ad.featured ? "Featured" : ad.package}
                    </Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{ad.description}</p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href={`/ads/${ad.slug}`}>View details</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

