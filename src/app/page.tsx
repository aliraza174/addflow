import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, TimerIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_10%_0%,rgba(236,72,153,0.3),transparent_40%),radial-gradient(900px_circle_at_95%_5%,rgba(139,92,246,0.35),transparent_42%),radial-gradient(900px_circle_at_50%_100%,rgba(251,146,60,0.25),transparent_42%)]" />
        <div className="float-gentle absolute left-8 top-32 h-24 w-24 rounded-full bg-fuchsia-300/50 blur-2xl" />
        <div className="float-gentle absolute right-12 top-44 h-28 w-28 rounded-full bg-violet-300/50 blur-2xl [animation-delay:0.8s]" />
        <div className="float-gentle absolute bottom-24 left-1/3 h-20 w-20 rounded-full bg-orange-300/45 blur-2xl [animation-delay:1.6s]" />
      </div>
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-6xl px-4">
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(closest-side,black,transparent)]">
            <div className="float-gentle absolute -left-24 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-3xl" />
            <div className="float-gentle absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-gradient-to-br from-rose-500 to-orange-300 blur-3xl [animation-delay:1.2s]" />
          </div>

          <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr] md:items-center">
            <Reveal>
              <Badge variant="secondary" className="mb-4">
                Sponsored listings • Moderation • Scheduling • Analytics
              </Badge>
              <h1 className="text-balance bg-gradient-to-r from-fuchsia-700 via-violet-700 to-rose-700 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl dark:from-fuchsia-300 dark:via-violet-300 dark:to-orange-200">
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
            </Reveal>

            <Reveal delay={0.08} className="glass aurora-surface rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Learning question</p>
                <Badge variant="secondary">Live widget</Badge>
              </div>
              <div className="mt-3 rounded-2xl bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-orange-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-700/80 dark:text-violet-200/80">
                  Product IQ
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Daily concept check for marketplace logic.</p>
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
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="sm:flex-1">
                  New question
                </Button>
                <Button className="sm:flex-1" asChild>
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        <Reveal className="pb-16" delay={0.1}>
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
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
