import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function FAQPage() {
  const faqs = [
    {
      q: "Why do only approved ads appear publicly?",
      a: "It enforces trust and ensures every public listing has passed moderation and payment verification.",
    },
    {
      q: "Do you host images or videos?",
      a: "No—media is stored as external URLs. We validate and normalize thumbnails (e.g., YouTube).",
    },
    {
      q: "What happens when a listing expires?",
      a: "It automatically transitions to Expired and is removed from public browsing.",
    },
  ];

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick answers to common questions about the platform workflow.
        </p>
        <div className="mt-8 grid gap-4">
          {faqs.map((f) => (
            <Card key={f.q} className="p-5">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

