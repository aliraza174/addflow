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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "moderator", "admin", "super_admin"]),
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
    defaultValues: { email: "demo@adflow.pro", password: "password", role: "client" },
  });

  async function onSubmit(values: FormValues) {
    try {
      setPending(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, name: "Demo User" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as any;
        throw new Error(data?.error || "Login failed");
      }
      toast.success("Welcome back");
      router.push(next);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-full bg-[radial-gradient(1000px_circle_at_10%_-10%,theme(colors.fuchsia.200/40%),transparent_45%),radial-gradient(900px_circle_at_90%_0%,theme(colors.indigo.200/45%),transparent_45%)] px-4 py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between">
          <Logo />
          <Badge variant="secondary">Mock auth (Supabase later)</Badge>
        </div>

        <Card className="mt-6 p-5">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Use any email/password. Pick a role to preview dashboards.
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

            <div className="grid gap-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={form.watch("role")}
                onValueChange={(v) => form.setValue("role", v as FormValues["role"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
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

