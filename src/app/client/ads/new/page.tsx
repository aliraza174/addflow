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
  condition: z.string().optional(),
  price: z.coerce.number().optional(),
  negotiable: z.boolean().optional().default(false),
  quantity: z.coerce.number().optional().default(1),
  tags: z.string().optional(), // We'll split this into an array before sending
  city: z.string().min(1),
  region: z.string().optional(),
  address: z.string().optional(),
  package: z.enum(["basic", "standard", "premium"]),
  mediaUrl: z.string().url("Must be a valid URL"),
  transactionRef: z.string().min(5, "Transaction reference must be at least 5 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ClientCreateAdPage() {
  const [pending, setPending] = React.useState(false);
  const [pendingMode, setPendingMode] = React.useState<"draft" | "submit" | null>(null);
  const [step, setStep] = React.useState(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "Professional logo design for startups",
      description: "Clean, modern logo systems with brand guidelines. Fast turnaround, multiple concepts, and scalable vector deliverables.",
      category: "services",
      city: "karachi",
      package: "standard",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      condition: "new",
      price: 150,
      negotiable: true,
      quantity: 1,
      tags: "logo, branding, startup",
      transactionRef: "TRX-12345",
    },
  });

  async function onSubmit(values: FormValues, mode: "draft" | "submit") {
    try {
      setPending(true);
      setPendingMode(mode);
      
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()) : [],
        mode,
      };

      const res = await fetch("/api/client/ads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to create ad");
      if (mode === "draft") {
        toast.success("Draft saved", { description: "You can edit and submit it later." });
        window.location.href = "/client/dashboard";
      } else {
        toast.success("Submitted for review", {
          description: "Your ad is now in moderator review queue.",
        });
        window.location.href = "/client/dashboard";
      }
      return;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create ad");
    } finally {
      setPending(false);
      setPendingMode(null);
    }
  }

  const handleNext = async () => {
    // Basic validation before moving next
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ["title", "description", "category", "price"];
    if (step === 2) fieldsToValidate = ["city", "region", "address"];
    if (step === 3) fieldsToValidate = ["mediaUrl"];
    if (step === 4) fieldsToValidate = ["package"];
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep((s) => s + 1);
  };

  const handlePrev = () => setStep((s) => s - 1);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Create ad</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Step {step} of 5 • {step === 1 ? "Basic Info" : step === 2 ? "Location" : step === 3 ? "Media" : step === 4 ? "Package Selection" : "Payment Proof"}
          </p>
        </div>
        <Badge variant="secondary">Draft</Badge>
      </div>

      <Card className="mt-5 p-5">
        <form className="grid gap-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">1. Basic Information</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input {...form.register("title")} />
                {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea rows={5} {...form.register("description")} />
                {form.formState.errors.description && <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={form.watch("category")} onValueChange={(v) => form.setValue("category", v as string)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="jobs">Jobs</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Condition</label>
                  <Select value={form.watch("condition")} onValueChange={(v) => form.setValue("condition", v as string)}>
                    <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Price (USD)</label>
                  <Input type="number" {...form.register("price")} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input {...form.register("tags")} placeholder="e.g. laptop, gaming, fast" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  id="negotiable"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={form.watch("negotiable")} 
                  onChange={(e) => form.setValue("negotiable", e.target.checked)} 
                />
                <label htmlFor="negotiable" className="text-sm font-medium cursor-pointer">Price is negotiable</label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">2. Location</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">City</label>
                  <Select value={form.watch("city")} onValueChange={(v) => form.setValue("city", v as string)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karachi">Karachi</SelectItem>
                      <SelectItem value="lahore">Lahore</SelectItem>
                      <SelectItem value="islamabad">Islamabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Region/Area</label>
                  <Input {...form.register("region")} placeholder="e.g. DHA Phase 6" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Full Address</label>
                <Textarea rows={2} {...form.register("address")} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">3. Media</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Main Media URL</label>
                <Input {...form.register("mediaUrl")} />
                {form.formState.errors.mediaUrl ? (
                  <p className="text-xs text-destructive">{form.formState.errors.mediaUrl.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Accepts direct image URLs and YouTube video URLs.</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">4. Package Selection</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Package</label>
                <Select value={form.watch("package")} onValueChange={(v) => form.setValue("package", v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic • 7 days ($9)</SelectItem>
                    <SelectItem value="standard">Standard • 15 days ($24)</SelectItem>
                    <SelectItem value="premium">Premium • 30 days ($59) • Homepage featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">5. Payment Proof</h3>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Transaction Reference ID</label>
                <Input {...form.register("transactionRef")} placeholder="e.g. Bank Ref or EasyPaisa TRX ID" />
                {form.formState.errors.transactionRef ? (
                  <p className="text-xs text-destructive">{form.formState.errors.transactionRef.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Please transfer the package amount to our bank account and enter the reference number here.</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between border-t pt-4">
            <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1 || pending}>
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="secondary" disabled={pending} onClick={form.handleSubmit((values) => onSubmit(values as unknown as FormValues, "draft"))}>
                {pending && pendingMode === "draft" ? "Saving…" : "Save draft"}
              </Button>
              
              {step < 5 ? (
                <Button type="button" onClick={handleNext}>Next</Button>
              ) : (
                <Button type="button" disabled={pending} onClick={form.handleSubmit((values) => onSubmit(values as unknown as FormValues, "submit"))}>
                  {pending && pendingMode === "submit" ? "Submitting…" : "Submit for review"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
