import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/mock-session";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { Badge } from "@/components/ui/badge";

type NavItem = { href: string; label: string; minRole?: "client" | "moderator" | "admin" };

const nav: NavItem[] = [
  { href: "/client/dashboard", label: "Client dashboard", minRole: "client" },
  { href: "/client/ads/new", label: "Create ad", minRole: "client" },
  { href: "/moderator/review-queue", label: "Review queue", minRole: "moderator" },
  { href: "/admin/dashboard", label: "Admin dashboard", minRole: "admin" },
  { href: "/admin/analytics", label: "Analytics", minRole: "admin" },
  { href: "/admin/system-health", label: "System health", minRole: "admin" },
];

function roleAtLeast(role: string, required: NonNullable<NavItem["minRole"]>) {
  const order = ["client", "moderator", "admin"] as const;
  if (!order.includes(role as any)) return false;
  return order.indexOf(role as any) >= order.indexOf(required);
}

export async function DashboardShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const user = session.user;
  const items = nav.filter((i) => !i.minRole || roleAtLeast(user.role, i.minRole));

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b border-violet-200/40 bg-background/55 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 dark:border-violet-300/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Logo />
          <Badge variant="secondary" className="hidden md:inline-flex">
            Authenticated
          </Badge>
          <div className="ml-auto">
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:grid-cols-[240px_1fr]">
        <aside className="glass rounded-2xl p-3">
          <nav className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-white/80 hover:text-foreground hover:shadow-sm dark:hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="glass aurora-surface rounded-2xl p-5">
          <div className="flex flex-col gap-1">
            <p className="mb-2 inline-flex w-fit rounded-full bg-gradient-to-r from-fuchsia-500/20 via-violet-500/20 to-orange-400/20 px-3 py-1 text-[11px] font-semibold tracking-wide text-violet-700 dark:text-violet-200">
              Workspace Experience
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

