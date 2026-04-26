import bcrypt from "bcryptjs";
import type { Role } from "@/lib/auth/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
};

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) {
  const supabase = createSupabaseAdminClient();
  const hashed = await bcrypt.hash(input.password, 10);
  const email = input.email.trim().toLowerCase();
  const role = input.role ?? "client";

  const { data, error } = await supabase
    .from("users")
    .insert({
      name: input.name.trim(),
      email,
      password_hash: hashed,
      role,
    })
    .select("id,name,email,role")
    .single();

  if (error) throw error;
  return data as { id: string; name: string; email: string; role: Role };
}

export async function findUserByEmail(emailInput: string) {
  const supabase = createSupabaseAdminClient();
  const email = emailInput.trim().toLowerCase();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash,role")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  return data as UserRow | null;
}

export async function validateUserCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

