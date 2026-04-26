import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/mock-session";
import type { Role } from "@/lib/auth/types";

const roleOrder: Role[] = ["client", "moderator", "admin"];

export function hasRole(userRole: Role, required: Role) {
  return roleOrder.indexOf(userRole) >= roleOrder.indexOf(required);
}

export async function requireRole(required: Role) {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }
  if (!hasRole(session.user.role, required)) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }
  return { error: null, session };
}

