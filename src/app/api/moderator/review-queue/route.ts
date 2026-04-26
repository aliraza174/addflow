import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { getModeratorQueue } from "@/lib/supabase/workflow";

export async function GET() {
  const auth = await requireRole("moderator");
  if (auth.error) return auth.error;

  try {
    const items = await getModeratorQueue();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

