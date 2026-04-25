import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-sm",
          size === "sm" && "h-8 w-8 text-sm",
          size === "md" && "h-9 w-9 text-base",
          size === "lg" && "h-10 w-10 text-lg"
        )}
        aria-hidden="true"
      >
        A
      </span>
      <span className="text-base leading-none sm:text-lg">
        AdFlow <span className="text-muted-foreground">Pro</span>
      </span>
    </Link>
  );
}

