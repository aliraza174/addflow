"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-full px-4 py-12">
          <div className="mx-auto w-full max-w-md">
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">Loading…</p>
            </Card>
          </div>
        </div>
      }
    >
      <LoginInner />
    </React.Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";
  const [pending, setPending] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@adflow.pro", password: "password" },
  });

  async function onSubmit(values: FormValues) {
    try {
      setPending(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as any;
        throw new Error(data?.error || "Login failed");
      }
      toast.success("Welcome back");
      router.push(next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-full overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-gentle absolute left-10 top-20 h-28 w-28 rounded-full bg-fuchsia-300/40 blur-2xl" />
        <div className="float-gentle absolute right-16 top-40 h-24 w-24 rounded-full bg-violet-300/40 blur-2xl [animation-delay:1s]" />
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <Logo />
          <Badge variant="secondary">Supabase auth</Badge>
        </div>

        <Card className="mt-6 border-violet-200/70 p-5 shadow-[0_40px_90px_-35px_rgba(168,85,247,0.85)]">
          <p className="mb-3 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500/15 via-violet-500/15 to-orange-400/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-violet-700 dark:text-violet-200">
            Premium Secure Workspace
          </p>
          <h1 className="bg-gradient-to-r from-fuchsia-700 via-violet-700 to-rose-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-fuchsia-300 dark:via-violet-300 dark:to-orange-200">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Login with your registered account. Role is loaded from database.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="you@company.com" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            New here?{" "}
            <Link className="font-medium text-foreground hover:underline" href="/auth/register">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

