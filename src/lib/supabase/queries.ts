import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeMediaUrl } from "@/lib/domain/media";
import type { Ad } from "@/lib/domain/types";

export async function getPackagesFromDb() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("packages")
    .select("id,name,duration_days,weight,is_featured,price")
    .order("weight", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as "basic" | "standard" | "premium",
    durationDays: row.duration_days as number,
    weight: row.weight as number,
    canHomepageFeature: row.is_featured as boolean,
    priceUsd: Number(row.price),
  }));
}

export async function getCategoriesFromDb() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("categories").select("slug").eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function getCitiesFromDb() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("cities").select("slug").eq("is_active", true);
  if (error) throw error;
  return (data ?? []).map((row) => row.slug);
}

export async function listPublishedAdsFromDb(params?: {
  query?: string;
  category?: string;
  city?: string;
  sort?: "rank" | "newest";
  page?: number;
  pageSize?: number;
}) {
  const supabase = createSupabaseAdminClient();
  
  let q = supabase
    .from("ads")
    .select(
      "id,slug,title,description,status,featured,admin_boost,publish_at,expire_at,created_at,packages!inner(name,weight),categories:categories!inner!ads_category_id_fkey(slug),cities!inner(slug),users(id,name),ad_media(source_type,original_url,thumbnail_url,validation_status),tags,condition,price,negotiable,quantity,region,address,latitude,longitude,attributes,view_count",
      { count: "exact" }
    )
    .eq("status", "published");

  if (params?.category) {
    q = q.eq("categories.slug", params.category);
  }
  if (params?.city) {
    q = q.eq("cities.slug", params.city);
  }
  if (params?.query) {
    const term = params.query.trim().toLowerCase();
    q = q.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const sort = params?.sort ?? "rank";
  if (sort === "newest") {
    q = q.order("created_at", { ascending: false });
  } else {
    // Basic approximation of ranking without RPC:
    // order by packages.weight, then admin_boost, then created_at
    q = q.order("packages(weight)", { ascending: false })
         .order("admin_boost", { ascending: false })
         .order("created_at", { ascending: false });
  }

  const page = Math.max(1, params?.page ?? 1);
  const pageSize = Math.max(1, Math.min(50, params?.pageSize ?? 9));
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  q = q.range(start, end);

  const { data, count, error } = await q;

  if (error) throw error;

  const items = (data ?? []).map((row: any) => {
    const mediaRow = Array.isArray(row.ad_media) ? row.ad_media[0] : row.ad_media;
    const media = mediaRow
      ? {
          sourceType: mediaRow.source_type,
          originalUrl: mediaRow.original_url,
          thumbnailUrl: mediaRow.thumbnail_url,
          validationStatus: mediaRow.validation_status,
        }
      : normalizeMediaUrl("https://example.com/placeholder.jpg");
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      status: row.status,
      package: row.packages?.name ?? "basic",
      category: row.categories?.slug ?? "services",
      city: row.cities?.slug ?? "karachi",
      featured: row.featured ?? false,
      adminBoost: row.admin_boost ?? 0,
      publishAt: row.publish_at,
      expireAt: row.expire_at,
      createdAt: row.created_at,
      seller: {
        id: row.users?.id ?? "unknown",
        displayName: row.users?.name ?? "Seller",
        city: row.cities?.slug ?? "karachi",
        isVerified: false,
      },
      media,
      tags: row.tags ?? [],
      condition: row.condition,
      price: row.price ? Number(row.price) : undefined,
      negotiable: row.negotiable ?? false,
      quantity: row.quantity ?? 1,
      region: row.region,
      address: row.address,
      latitude: row.latitude ? Number(row.latitude) : undefined,
      longitude: row.longitude ? Number(row.longitude) : undefined,
      attributes: row.attributes ?? {},
      viewCount: row.view_count ?? 0,
    } as Ad;
  });

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    meta: { total, totalPages, page, pageSize },
  };
}

export async function getPublishedAdBySlugFromDb(slug: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ads")
    .select(
      "id,slug,title,description,status,featured,admin_boost,publish_at,expire_at,created_at,packages(name),categories:categories!ads_category_id_fkey(slug),cities(slug),users(id,name),ad_media(source_type,original_url,thumbnail_url,validation_status),tags,condition,price,negotiable,quantity,region,address,latitude,longitude,attributes,view_count"
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  const row = data as any;
  const mediaRow = Array.isArray(row.ad_media) ? row.ad_media[0] : row.ad_media;
  const media = mediaRow
    ? {
        sourceType: mediaRow.source_type,
        originalUrl: mediaRow.original_url,
        thumbnailUrl: mediaRow.thumbnail_url,
        validationStatus: mediaRow.validation_status,
      }
    : normalizeMediaUrl("https://example.com/placeholder.jpg");

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    status: row.status,
    package: row.packages?.name ?? "basic",
    category: row.categories?.slug ?? "services",
    city: row.cities?.slug ?? "karachi",
    featured: row.featured ?? false,
    adminBoost: row.admin_boost ?? 0,
    publishAt: row.publish_at,
    expireAt: row.expire_at,
    createdAt: row.created_at,
    seller: {
      id: row.users?.id ?? "unknown",
      displayName: row.users?.name ?? "Seller",
      city: row.cities?.slug ?? "karachi",
      isVerified: false,
    },
    media,
    tags: row.tags ?? [],
    condition: row.condition,
    price: row.price ? Number(row.price) : undefined,
    negotiable: row.negotiable ?? false,
    quantity: row.quantity ?? 1,
    region: row.region,
    address: row.address,
    latitude: row.latitude ? Number(row.latitude) : undefined,
    longitude: row.longitude ? Number(row.longitude) : undefined,
    attributes: row.attributes ?? {},
    viewCount: row.view_count ?? 0,
  } as Ad;
}

