import { NextResponse } from "next/server";
import { listPublishedAdsFromDb } from "@/lib/supabase/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const sort = searchParams.get("sort") === "newest" ? "newest" : "rank";
  const page = Number(searchParams.get("page") ?? "1") || 1;
  const pageSize = Number(searchParams.get("pageSize") ?? "9") || 9;

  try {
    const data = await listPublishedAdsFromDb({ query, category, city, sort, page, pageSize });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

