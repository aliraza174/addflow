"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  title: z.string().min(8, "Title must be at least 8 characters"),
  description: z.string().min(40, "Description must be at least 40 characters"),
  category: z.string().min(1),
  city: z.string().min(1),
  package: z.enum(["basic", "standard", "premium"]),
  mediaUrl: z.string().url("Must be a valid URL"),
});

type FormValues = z.infer<typeof schema>;

export default function ClientCreateAdPage() {
  const [pending, setPending] = React.useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "Professional logo design for startups",
      description:
        "Clean, modern logo systems with brand guidelines. Fast turnaround, multiple concepts, and scalable vector deliverables.",
      category: "services",
      city: "karachi",
      package: "standard",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setPending(true);
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Draft saved", { description: "Next: submit for moderation review." });
      console.log(values);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Create ad</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            External media URLs only. YouTube links auto-generate thumbnails.
          </p>
        </div>
        <Badge variant="secondary">Draft</Badge>
      </div>

      <Card className="mt-5 p-5">
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...form.register("title")} />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={7} {...form.register("description")} />
            {form.formState.errors.description ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={form.watch("category")}
                onValueChange={(v) => form.setValue("category", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">City</label>
              <Select
                value={form.watch("city")}
                onValueChange={(v) => form.setValue("city", v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="karachi">Karachi</SelectItem>
                  <SelectItem value="lahore">Lahore</SelectItem>
                  <SelectItem value="islamabad">Islamabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Package</label>
            <Select
              value={form.watch("package")}
              onValueChange={(v) => form.setValue("package", v as FormValues["package"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic • 7 days</SelectItem>
                <SelectItem value="standard">Standard • 15 days</SelectItem>
                <SelectItem value="premium">Premium • 30 days • Homepage featured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Media URL</label>
            <Input {...form.register("mediaUrl")} />
            {form.formState.errors.mediaUrl ? (
              <p className="text-xs text-destructive">{form.formState.errors.mediaUrl.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Accepts direct image URLs and YouTube video URLs.
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save draft"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => toast.info("Next step", { description: "Submit to moderation queue." })}
            >
              Submit for review (next)
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

