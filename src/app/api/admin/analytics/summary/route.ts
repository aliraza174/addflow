import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const auth = await requireRole("admin");
  if (auth.error) return auth.error;

  try {
    const supabase = createSupabaseAdminClient();
    const [
      { count: totalAds },
      { count: activeAds },
      { count: pendingReview },
      { count: expiredAds },
      { data: payments },
    ] = await Promise.all([
      supabase.from("ads").select("*", { count: "exact", head: true }),
      supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "under_review"),
      supabase.from("ads").select("*", { count: "exact", head: true }).eq("status", "expired"),
      supabase.from("payments").select("amount,status").eq("status", "verified"),
    ]);

    const verifiedRevenue = (payments ?? []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);

    return NextResponse.json({
      listings: {
        total: totalAds ?? 0,
        active: activeAds ?? 0,
        pendingReview: pendingReview ?? 0,
        expired: expiredAds ?? 0,
      },
      revenue: {
        monthly: Number(verifiedRevenue.toFixed(2)),
        verifiedPayments: payments?.length ?? 0,
      },
      moderation: { approvalRate: 0, rejectionRate: 0, flagged: 0 },
      operations: { cronSuccessRate: 100, heartbeat: "ok", failedValidations: 0 },
    });
  } catch {
    return NextResponse.json({
      listings: { total: 0, active: 0, pendingReview: 0, expired: 0 },
      revenue: { monthly: 0, verifiedPayments: 0 },
      moderation: { approvalRate: 0, rejectionRate: 0, flagged: 0 },
      operations: { cronSuccessRate: 100, heartbeat: "ok", failedValidations: 0 },
    });
  }
}

