import { NextResponse } from "next/server";
import { getPackagesFromDb } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const items = await getPackagesFromDb();
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
