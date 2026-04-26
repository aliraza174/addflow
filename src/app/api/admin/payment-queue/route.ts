import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/guards";
import { getPaymentQueue } from "@/lib/supabase/workflow";

export async function GET() {
  const auth = await requireRole("admin");
  if (auth.error) return auth.error;

  try {
    const items = await getPaymentQueue();
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

