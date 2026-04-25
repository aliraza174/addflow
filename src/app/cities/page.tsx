import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function CitiesIndexPage() {
  const cities = [
    { name: "Karachi", slug: "karachi" },
    { name: "Lahore", slug: "lahore" },
    { name: "Islamabad", slug: "islamabad" },
    { name: "Faisalabad", slug: "faisalabad" },
    { name: "Multan", slug: "multan" },
    { name: "Peshawar", slug: "peshawar" },
  ];

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Cities</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover ads by city pages for clean navigation and SEO-friendly links.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {cities.map((c) => (
            <Link key={c.slug} href={`/cities/${c.slug}`}>
              <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Browse active ads</p>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

