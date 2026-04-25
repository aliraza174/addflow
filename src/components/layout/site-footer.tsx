import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A production-style sponsored listing workflow: clients submit, moderators review,
            admins verify payments, and packages control visibility and ranking.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Platform</p>
          <Link className="text-muted-foreground hover:text-foreground" href="/explore">
            Explore Ads
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/packages">
            Packages
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/policy">
            Usage Policy
          </Link>
        </div>
        <div className="grid gap-2 text-sm">
          <p className="font-semibold">Company</p>
          <Link className="text-muted-foreground hover:text-foreground" href="/contact">
            Contact
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/faq">
            FAQ
          </Link>
          <div className="flex gap-3">
            <Link className="text-muted-foreground hover:text-foreground" href="/terms">
              Terms
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/privacy">
              Privacy
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AdFlow Pro. All rights reserved.</p>
          <p>Built for a real-world workflow demo.</p>
        </div>
      </div>
    </footer>
  );
}

