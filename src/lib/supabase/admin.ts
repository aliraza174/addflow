import { createClient } from "@supabase/supabase-js";

function getProjectUrl() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return raw.replace(/\/rest\/v1\/?$/, "");
}

export function createSupabaseAdminClient() {
  const url = getProjectUrl();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceRole) {
    throw new Error("Supabase env vars are missing");
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

