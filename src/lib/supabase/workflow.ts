import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getModeratorQueue() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ads")
    .select("id,title,created_at,categories:categories!ads_category_id_fkey(name,slug),cities(name,slug),ad_media(source_type,validation_status)")
    .eq("status", "under_review")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function reviewAd(input: {
  adId: string;
  nextStatus: "payment_pending" | "rejected";
  actorId: string;
  note?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { data: current, error: currentErr } = await supabase
    .from("ads")
    .select("id,status,user_id")
    .eq("id", input.adId)
    .single();
  if (currentErr) throw currentErr;

  const { error: updateErr } = await supabase
    .from("ads")
    .update({ status: input.nextStatus, updated_at: new Date().toISOString() })
    .eq("id", input.adId);
  if (updateErr) throw updateErr;

  await supabase.from("ad_status_history").insert({
    ad_id: input.adId,
    previous_status: current.status,
    new_status: input.nextStatus,
    changed_by: input.actorId,
    note: input.note ?? null,
  });

  await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action_type: "moderation_review",
    target_type: "ad",
    target_id: input.adId,
    old_value: { status: current.status },
    new_value: { status: input.nextStatus, note: input.note ?? null },
  });

  await supabase.from("notifications").insert({
    user_id: current.user_id,
    title: input.nextStatus === "payment_pending" ? "Ad approved by moderator" : "Ad rejected",
    message:
      input.nextStatus === "payment_pending"
        ? "Your ad passed content review and is waiting for payment submission."
        : input.note || "Your ad was rejected by moderator review.",
    type: input.nextStatus === "payment_pending" ? "success" : "warning",
    is_read: false,
    link: "/client/dashboard",
  });
}

export async function getPaymentQueue() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id,amount,method,transaction_ref,status,ads(id,title,user_id)")
    .eq("status", "submitted")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function verifyPayment(input: {
  paymentId: string;
  actorId: string;
  approve: boolean;
  note?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { data: payment, error: pErr } = await supabase
    .from("payments")
    .select("id,ad_id,status,ads(user_id,status)")
    .eq("id", input.paymentId)
    .single();
  if (pErr) throw pErr;

  const nextPaymentStatus = input.approve ? "verified" : "rejected";
  const nextAdStatus = input.approve ? "payment_verified" : "rejected";
  const relatedAd = Array.isArray(payment.ads) ? payment.ads[0] : payment.ads;

  const { error: payUpdateErr } = await supabase
    .from("payments")
    .update({ status: nextPaymentStatus })
    .eq("id", input.paymentId);
  if (payUpdateErr) throw payUpdateErr;

  const { error: adUpdateErr } = await supabase
    .from("ads")
    .update({ status: nextAdStatus, updated_at: new Date().toISOString() })
    .eq("id", payment.ad_id);
  if (adUpdateErr) throw adUpdateErr;

  await supabase.from("ad_status_history").insert({
    ad_id: payment.ad_id,
    previous_status: relatedAd?.status ?? "payment_submitted",
    new_status: nextAdStatus,
    changed_by: input.actorId,
    note: input.note ?? null,
  });

  await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action_type: "payment_verify",
    target_type: "payment",
    target_id: input.paymentId,
    old_value: { status: payment.status },
    new_value: { status: nextPaymentStatus, note: input.note ?? null },
  });

  if (relatedAd?.user_id) {
    await supabase.from("notifications").insert({
      user_id: relatedAd.user_id,
      title: input.approve ? "Payment verified" : "Payment rejected",
      message: input.approve
        ? "Your payment was verified. Admin can now schedule/publish your ad."
        : input.note || "Your payment proof was rejected.",
      type: input.approve ? "success" : "warning",
      is_read: false,
      link: "/client/dashboard",
    });
  }
}

export async function getClientDashboardData(userId: string) {
  const supabase = createSupabaseAdminClient();
  const [{ data: ads }, { data: notifications }] = await Promise.all([
    supabase
      .from("ads")
      .select("id,title,status,updated_at,packages(name)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("notifications")
      .select("id,title,message,type,is_read,created_at,link")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    ads: ads ?? [],
    notifications: notifications ?? [],
  };
}

export async function runPublishScheduledJobInDb() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  
  // Find ads to publish
  const { data: adsToPublish, error: fetchErr } = await supabase
    .from("ads")
    .select("id")
    .eq("status", "scheduled")
    .lte("publish_at", now);
    
  if (fetchErr || !adsToPublish || adsToPublish.length === 0) return 0;
  
  const adIds = adsToPublish.map((a) => a.id);
  
  // Update status
  const { error: updateErr } = await supabase
    .from("ads")
    .update({ status: "published", updated_at: now })
    .in("id", adIds);
    
  if (updateErr) throw updateErr;
  
  // Insert history
  const historyEntries = adIds.map(id => ({
    ad_id: id,
    previous_status: "scheduled" as const,
    new_status: "published" as const,
    changed_by: null, // system
    note: "Automatically published by scheduled job",
  }));
  
  await supabase.from("ad_status_history").insert(historyEntries);
  
  return adIds.length;
}

export async function runExpireAdsJobInDb() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  
  // Find ads to expire
  const { data: adsToExpire, error: fetchErr } = await supabase
    .from("ads")
    .select("id")
    .eq("status", "published")
    .lte("expire_at", now);
    
  if (fetchErr || !adsToExpire || adsToExpire.length === 0) return 0;
  
  const adIds = adsToExpire.map((a) => a.id);
  
  // Update status
  const { error: updateErr } = await supabase
    .from("ads")
    .update({ status: "expired", updated_at: now })
    .in("id", adIds);
    
  if (updateErr) throw updateErr;
  
  // Insert history
  const historyEntries = adIds.map(id => ({
    ad_id: id,
    previous_status: "published" as const,
    new_status: "expired" as const,
    changed_by: null, // system
    note: "Automatically expired by scheduled job",
  }));
  
  await supabase.from("ad_status_history").insert(historyEntries);
  
  return adIds.length;
}

