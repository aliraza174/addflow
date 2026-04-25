import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdDetailPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  if (!slug) notFound();

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/explore" className="hover:text-foreground">
                Explore
              </Link>{" "}
              / <span className="text-foreground">{slug}</span>
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Demo Ad: {slug}</h1>
          </div>
          <Button variant="outline">Report</Button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-muted" />
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>Premium</Badge>
                <Badge variant="secondary">Payment verified</Badge>
                <Badge variant="outline">City: Karachi</Badge>
                <Badge variant="outline">Category: Services</Badge>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                This is a placeholder detail page. Next we’ll wire up external media normalization
                (YouTube thumbnail extraction + image URL validation), seller summary, and public
                visibility rules (approved + non-expired only).
              </p>
            </div>
          </Card>

          <div className="grid gap-4">
            <Card className="p-5">
              <p className="text-sm font-semibold">Seller</p>
              <p className="mt-2 text-sm text-muted-foreground">Verified Seller • 4.9 rating</p>
              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span>May 10, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span>Premium (30 days)</span>
                </div>
              </div>
              <Button className="mt-5 w-full" asChild>
                <Link href="/auth/login">Message seller</Link>
              </Button>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold">Media health</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Placeholder preview. We’ll add “validation_status” + fallback thumbnails.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">source_type: youtube</Badge>
                <Badge variant="secondary">status: ok</Badge>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

