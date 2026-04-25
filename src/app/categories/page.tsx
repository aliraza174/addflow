import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function CategoriesIndexPage() {
  const cats = [
    { name: "Services", slug: "services" },
    { name: "Real Estate", slug: "real-estate" },
    { name: "Jobs", slug: "jobs" },
    { name: "Electronics", slug: "electronics" },
    { name: "Vehicles", slug: "vehicles" },
    { name: "Education", slug: "education" },
  ];

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse ads by taxonomy-driven navigation.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cats.map((c) => (
            <Link key={c.slug} href={`/categories/${c.slug}`}>
              <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">View active listings</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

