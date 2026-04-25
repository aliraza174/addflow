import { cookies } from "next/headers";
import type { Role, Session } from "@/lib/auth/types";

const COOKIE_NAME = "adflow_session";

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return safeJsonParse<Session>(raw);
}

export async function setSession(input: {
  email: string;
  name: string;
  role: Role;
}) {
  const jar = await cookies();
  const session: Session = {
    user: {
      id: crypto.randomUUID(),
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      role: input.role,
    },
    createdAt: new Date().toISOString(),
  };

  jar.set({
    name: COOKIE_NAME,
    value: JSON.stringify(session),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return session;
}

export async function clearSession() {
  const jar = await cookies();
  jar.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

