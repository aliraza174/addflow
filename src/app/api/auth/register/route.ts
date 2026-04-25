import { NextResponse } from "next/server";
import { z } from "zod";
import { setSession } from "@/lib/auth/mock-session";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
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

  // Mock register: create a client session.
  const session = await setSession({
    email: parsed.data.email,
    name: parsed.data.name,
    role: "client",
  });

  return NextResponse.json({ session });
}

