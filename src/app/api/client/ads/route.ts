import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/guards";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeMediaUrl } from "@/lib/domain/media";

const schema = z.object({
  title: z.string().min(8),
  description: z.string().min(40),
  category: z.string().min(1),
  city: z.string().min(1),
  package: z.enum(["basic", "standard", "premium"]),
  mediaUrl: z.string().url(),
  mode: z.enum(["draft", "submit", "publish_demo"]).default("submit"),
  tags: z.array(z.string()).optional().default([]),
  condition: z.string().optional(),
  price: z.coerce.number().optional(),
  negotiable: z.boolean().optional().default(false),
  quantity: z.coerce.number().optional().default(1),
  region: z.string().optional(),
  address: z.string().optional(),
  attributes: z.record(z.string(), z.any()).optional().default({}),
  transactionRef: z.string().optional(),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  const auth = await requireRole("client");
  if (auth.error) return auth.error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const v = parsed.data;

  const [{ data: pkg }, { data: category }, { data: city }] = await Promise.all([
    supabase.from("packages").select("id,duration_days,price").eq("name", v.package).single(),
    supabase.from("categories").select("id").eq("slug", v.category).single(),
    supabase.from("cities").select("id").eq("slug", v.city).single(),
  ]);

  if (!pkg || !category || !city) {
    return NextResponse.json({ error: "Invalid package/category/city" }, { status: 400 });
  }

  const slugBase = slugify(v.title);
  const slug = `${slugBase}-${Date.now().toString().slice(-5)}`;
  const now = new Date();
  const expireAt = new Date(now.getTime() + pkg.duration_days * 24 * 60 * 60 * 1000);
  
  // Workflow: If they submitted payment proof, status should technically be 'payment_submitted' or 'under_review'
  // We'll set to under_review to ensure the moderator checks the ad content first.
  const status =
    v.mode === "draft" ? "draft" : v.mode === "submit" ? "under_review" : "published";
  const publishAt = status === "published" ? now.toISOString() : null;
  const adExpireAt = status === "published" ? expireAt.toISOString() : null;

  const { data: ad, error: adErr } = await supabase
    .from("ads")
    .insert({
      user_id: auth.session.user.id,
      package_id: pkg.id,
      title: v.title,
      slug,
      category_id: category.id,
      city_id: city.id,
      description: v.description,
      status,
      publish_at: publishAt,
      expire_at: adExpireAt,
      tags: v.tags,
      condition: v.condition,
      price: v.price,
      negotiable: v.negotiable,
      quantity: v.quantity,
      region: v.region,
      address: v.address,
      attributes: v.attributes,
    })
    .select("id,slug")
    .single();
  if (adErr) return NextResponse.json({ error: adErr.message }, { status: 500 });

  const media = normalizeMediaUrl(v.mediaUrl);
  await supabase.from("ad_media").insert({
    ad_id: ad.id,
    source_type: media.sourceType,
    original_url: media.originalUrl,
    thumbnail_url: media.thumbnailUrl,
    validation_status: media.validationStatus,
  });

  // If transactionRef provided, log the payment
  if (v.transactionRef) {
    await supabase.from("payments").insert({
      ad_id: ad.id,
      amount: pkg.price,
      method: "bank_transfer",
      transaction_ref: v.transactionRef,
      status: "submitted",
    });
  }

  await supabase.from("ad_status_history").insert({
    ad_id: ad.id,
    previous_status: null,
    new_status: status,
    changed_by: auth.session.user.id,
    note:
      status === "draft"
        ? "Saved as draft"
        : status === "under_review"
          ? "Submitted for moderation review"
          : "Created from client dashboard (demo instant publish)",
  });

  return NextResponse.json({ ok: true, ad });
}

