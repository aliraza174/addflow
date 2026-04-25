import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, TimerIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-full bg-[radial-gradient(1200px_circle_at_10%_-10%,theme(colors.fuchsia.200/40%),transparent_40%),radial-gradient(1000px_circle_at_90%_0%,theme(colors.indigo.200/45%),transparent_45%),radial-gradient(900px_circle_at_50%_100%,theme(colors.rose.200/35%),transparent_45%)]">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(closest-side,black,transparent)]">
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 blur-3xl" />
            <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-gradient-to-br from-rose-500 to-amber-400 blur-3xl" />
          </div>

          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Sponsored listings • Moderation • Scheduling • Analytics
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                A premium marketplace workflow for sponsored listings.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
                Clients submit ads, moderators review content, admins verify payments, and approved
                listings go live on a package-based schedule—complete with ranking, expiry, and
                health automation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/explore">
                    Explore live ads <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link href="/packages">
                    View packages <SparklesIcon className="size-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheckIcon className="size-4 text-emerald-600" />
                    Moderated quality
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Only approved, non-expired ads are public.
                  </p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <TimerIcon className="size-4 text-indigo-600" />
                    Auto scheduling
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Publish and expire automatically by package rules.
                  </p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <SparklesIcon className="size-4 text-fuchsia-600" />
                    Smart ranking
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Featured + package weight + freshness boosts.
                  </p>
                </Card>
              </div>
            </div>

            <div className="rounded-3xl border bg-background/70 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Learning question</p>
                <Badge variant="secondary">Live widget</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Q: Why should expired ads never appear in public results?
              </p>
              <div className="mt-4 rounded-2xl bg-muted p-4">
                <p className="text-sm">
                  A: It protects business logic, avoids broken expectations, and keeps ranking and
                  analytics consistent.
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="w-full">
                  New question
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Packages</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose visibility, duration, and placement rules.
              </p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/packages">See all</Link>
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { name: "Basic", days: 7, weight: "1×", price: "$9", hint: "Lowest entry plan" },
              {
                name: "Standard",
                days: 15,
                weight: "2×",
                price: "$24",
                hint: "Category priority",
              },
              {
                name: "Premium",
                days: 30,
                weight: "3×",
                price: "$59",
                hint: "Homepage featured slots",
              },
            ].map((p) => (
              <Card key={p.name} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{p.name}</p>
                  <Badge variant={p.name === "Premium" ? "default" : "secondary"}>
                    {p.weight} weight
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.hint}</p>
                <div className="mt-6 flex items-baseline justify-between">
                  <p className="text-3xl font-semibold">{p.price}</p>
                  <p className="text-sm text-muted-foreground">{p.days} days</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
