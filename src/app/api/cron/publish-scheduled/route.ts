import { NextResponse } from "next/server";
import { runPublishScheduledJobInDb } from "@/lib/supabase/workflow";

export async function POST() {
  try {
    const changed = await runPublishScheduledJobInDb();
    return NextResponse.json({
      ok: true,
      changed,
      ranAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

