"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/logo";

const schema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Ali Raza",
      email: "ali@example.com",
      password: "password",
      confirmPassword: "password",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setPending(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as any;
        throw new Error(data?.error || "Registration failed");
      }
      toast.success("Account created");
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative min-h-full overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="float-gentle absolute left-8 top-16 h-24 w-24 rounded-full bg-violet-300/35 blur-2xl" />
        <div className="float-gentle absolute right-12 top-36 h-28 w-28 rounded-full bg-rose-300/35 blur-2xl [animation-delay:1.1s]" />
      </div>
      <div className="mx-auto w-full max-w-md">
        <Logo />
        <Card className="mt-6 border-violet-200/70 p-5 shadow-[0_40px_90px_-35px_rgba(168,85,247,0.85)]">
          <p className="mb-3 inline-flex rounded-full bg-gradient-to-r from-violet-500/15 via-fuchsia-500/15 to-orange-400/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-violet-700 dark:text-violet-200">
            Create Your Workspace
          </p>
          <h1 className="bg-gradient-to-r from-violet-700 via-fuchsia-700 to-rose-700 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-orange-200">
            Create account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You’ll land in the client dashboard after registering.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("name")} />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...form.register("email")} />
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
              <label className="text-sm font-medium">Confirm password</label>
              <Input type="password" {...form.register("confirmPassword")} />
              {form.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Creating…" : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-foreground hover:underline" href="/auth/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

