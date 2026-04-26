import { NextResponse } from "next/server";
import { z } from "zod";
import { setExistingSession } from "@/lib/auth/mock-session";
import { validateUserCredentials } from "@/lib/auth/users";

const schema = z.object({
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

  const user = await validateUserCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const session = await setExistingSession({
    user,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ session });
}

