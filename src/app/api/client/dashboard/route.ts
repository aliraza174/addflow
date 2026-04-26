import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { getClientDashboardData } from "@/lib/supabase/workflow";

export async function GET() {
  const auth = await requireRole("client");
  if (auth.error) return auth.error;

  const data = await getClientDashboardData(auth.session.user.id);
  return NextResponse.json({
    user: auth.session.user,
    ...data,
  });
}

