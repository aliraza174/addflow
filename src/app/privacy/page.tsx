import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A short privacy policy suitable for a portfolio demo.
        </p>
        <Card className="mt-8 p-5">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              We store account identity, listing metadata, payment proof metadata, and audit logs for
              traceability. Media is stored as external URLs (no local uploads). In production, you
              would add retention policies and stricter access controls.
            </p>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

