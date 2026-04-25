import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession } from "@/lib/auth/mock-session";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "moderator", "admin", "super_admin"]).default("client"),
  name: z.string().min(2).default("Ali"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Mock auth: accept any credentials that pass validation.
  const session = await setSession({
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role,
  });

  return NextResponse.json({ session });
}

