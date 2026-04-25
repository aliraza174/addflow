import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/mock-session";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/auth/user-menu";
import { Badge } from "@/components/ui/badge";

type NavItem = { href: string; label: string; minRole?: "client" | "moderator" | "admin" | "super_admin" };

const nav: NavItem[] = [
  { href: "/client/dashboard", label: "Client dashboard", minRole: "client" },
  { href: "/client/ads/new", label: "Create ad", minRole: "client" },
  { href: "/moderator/review-queue", label: "Review queue", minRole: "moderator" },
  { href: "/admin/dashboard", label: "Admin dashboard", minRole: "admin" },
  { href: "/admin/analytics", label: "Analytics", minRole: "admin" },
  { href: "/admin/system-health", label: "System health", minRole: "admin" },
  { href: "/super/system", label: "System settings", minRole: "super_admin" },
];

function roleAtLeast(role: string, required: NonNullable<NavItem["minRole"]>) {
  const order = ["client", "moderator", "admin", "super_admin"] as const;
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
    <div className="min-h-full bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
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
        <aside className="rounded-2xl border bg-background p-3">
          <nav className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="rounded-2xl border bg-background p-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

