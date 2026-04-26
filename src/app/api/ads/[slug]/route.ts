import { NextResponse } from "next/server";
import { getPublishedAdBySlugFromDb } from "@/lib/supabase/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  let ad = null;
  try {
    ad = await getPublishedAdBySlugFromDb(slug);
  } catch {}
  if (!ad) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: ad });
}

