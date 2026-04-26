import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "adflow_session";
const encoder = new TextEncoder();

async function getRoleFromCookie(req: NextRequest):
  Promise<"client" | "moderator" | "admin" | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const secret = process.env.AUTH_JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    const parsed = payload as { user?: { role?: string } };
    const role = parsed?.user?.role;
    if (role === "client" || role === "moderator" || role === "admin") {
      return role;
    }
    return null;
  } catch {
    return null;
  }
}

function roleAtLeast(role: "client" | "moderator" | "admin", required: "client" | "moderator" | "admin") {
  const order = ["client", "moderator", "admin"] as const;
  return order.indexOf(role) >= order.indexOf(required);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRoleFromCookie(req);

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

  if (pathname.startsWith("/super")) {
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

