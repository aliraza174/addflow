import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { reviewAd } from "@/lib/supabase/workflow";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  note: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole("moderator");
  if (auth.error) return auth.error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { id } = await params;
  await reviewAd({
    adId: id,
    nextStatus: parsed.data.action === "approve" ? "payment_pending" : "rejected",
    actorId: auth.session.user.id,
    note: parsed.data.note,
  });

  return NextResponse.json({ ok: true });
}

