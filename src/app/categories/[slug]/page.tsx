import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Category: <span className="capitalize">{params.slug.replaceAll("-", " ")}</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Showing active-only ads in this category.
            </p>
          </div>
          <Badge variant="secondary">Active only</Badge>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <p className="font-semibold">Category listing #{i + 1}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Placeholder. Will be powered by rankScore + filters.
              </p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

