import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions, reports, or partnership inquiries—send a message.
        </p>
        <Card className="mt-8 p-5">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input placeholder="you@example.com" type="email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="How can we help?" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Write your message…" rows={6} />
            </div>
            <Button type="button">Send</Button>
          </form>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

