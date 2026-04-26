import { NextResponse } from "next/server";
import { z } from "zod";
import { setExistingSession } from "@/lib/auth/mock-session";
import { createUser } from "@/lib/auth/users";

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

  try {
    const user = await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
      role: "client",
    });

    const session = await setExistingSession({
      user,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ session });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

