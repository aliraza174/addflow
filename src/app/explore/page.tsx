import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ExplorePage() {
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
          <div className="flex w-full gap-2 md:w-[420px]">
            <Input placeholder="Search title, seller, keywords…" />
            <Button>Search</Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="secondary">Active only</Badge>
          <Badge variant="outline">Category: All</Badge>
          <Badge variant="outline">City: All</Badge>
          <Badge variant="outline">Sort: Rank</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[16/10] bg-muted" />
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold leading-tight">Demo Listing #{i + 1}</p>
                  <Badge variant={i % 5 === 0 ? "default" : "secondary"}>
                    {i % 5 === 0 ? "Featured" : "Standard"}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  External media URLs only. YouTube thumbnails and image validation are normalized
                  at runtime.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/ads/demo-${i + 1}`}>View</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">Expires in 12 days</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <Button variant="outline">Prev</Button>
          <Button variant="outline">Next</Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

