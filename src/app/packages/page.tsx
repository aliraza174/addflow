import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function PackagesPage() {
  const packages = [
    {
      name: "Basic",
      duration: "7 days",
      visibility: "Standard",
      featured: "No",
      weight: "1×",
      price: "$9",
    },
    {
      name: "Standard",
      duration: "15 days",
      visibility: "Category priority",
      featured: "No",
      weight: "2×",
      price: "$24",
    },
    {
      name: "Premium",
      duration: "30 days",
      visibility: "Homepage placement",
      featured: "Yes",
      weight: "3×",
      price: "$59",
    },
  ] as const;

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Packages</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Packages control duration, ranking, and homepage placement rules.
            </p>
          </div>
          <Button asChild>
            <Link href="/auth/register">Create account</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <Card key={p.name} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{p.name}</p>
                <Badge variant={p.name === "Premium" ? "default" : "secondary"}>{p.weight}</Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{p.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="text-right">{p.visibility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Featured</span>
                  <span>{p.featured}</span>
                </div>
              </div>
              <div className="mt-6 flex items-baseline justify-between">
                <p className="text-3xl font-semibold">{p.price}</p>
                <p className="text-sm text-muted-foreground">per listing</p>
              </div>
              <Button className="mt-5 w-full" variant={p.name === "Premium" ? "default" : "outline"}>
                Select {p.name}
              </Button>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

