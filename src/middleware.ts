import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "adflow_session";

function getRoleFromCookie(req: NextRequest):
  | "client"
  | "moderator"
  | "admin"
  | "super_admin"
  | null {
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { user?: { role?: string } };
    const role = parsed?.user?.role;
    if (
      role === "client" ||
      role === "moderator" ||
      role === "admin" ||
      role === "super_admin"
    ) {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

function roleAtLeast(
  role: NonNullable<ReturnType<typeof getRoleFromCookie>>,
  required: "client" | "moderator" | "admin" | "super_admin"
) {
  const order = ["client", "moderator", "admin", "super_admin"] as const;
  return order.indexOf(role) >= order.indexOf(required);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = getRoleFromCookie(req);

  const isAuth = pathname.startsWith("/auth");
  const isProtected =
    pathname.startsWith("/client") ||
    pathname.startsWith("/moderator") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/super");

  if (isAuth && role) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isProtected && !role) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/moderator") && role && !roleAtLeast(role, "moderator")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && role && !roleAtLeast(role, "admin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/super") && role !== "super_admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/client/:path*",
    "/moderator/:path*",
    "/admin/:path*",
    "/super/:path*",
  ],
};

