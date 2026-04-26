import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const start = Date.now();
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("packages").select("id").limit(1);
    const responseMs = Date.now() - start;
    if (error) throw error;
    return NextResponse.json({
      status: "ok",
      source: "supabase",
      checkedAt: new Date().toISOString(),
      responseMs,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: "error",
      source: "supabase",
      checkedAt: new Date().toISOString(),
      error: err.message,
    }, { status: 503 });
  }
}

