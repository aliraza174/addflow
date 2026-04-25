import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
        <p className="mt-2 text-sm text-muted-foreground">Platform terms for a demo marketplace.</p>
        <Card className="mt-8 p-5">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>
              AdFlow Pro is a demo application showcasing a moderated listing workflow. Public
              content is visible only after moderation and payment verification. Media links must be
              externally hosted and safe for work.
            </p>
            <ul>
              <li>Do not submit illegal, harmful, or deceptive content.</li>
              <li>Duplicate payments and suspicious media may be flagged.</li>
              <li>Expired listings are removed from public browsing automatically.</li>
            </ul>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

