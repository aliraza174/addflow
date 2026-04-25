import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

export default function PolicyPage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Platform Usage Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Moderation guidelines for listings and external media URLs.
        </p>
        <Card className="mt-8 p-5">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h3>Allowed</h3>
            <ul>
              <li>Direct public image URLs</li>
              <li>YouTube video URLs (thumbnail auto-generated)</li>
              <li>GitHub raw image URLs</li>
            </ul>
            <h3>Not allowed</h3>
            <ul>
              <li>Malware, phishing, or deceptive links</li>
              <li>Adult content, hate speech, or illegal offerings</li>
              <li>Broken or private links that prevent preview</li>
            </ul>
            <p>
              Moderators can reject with reason and add internal notes. Flagged content is tracked
              for auditing.
            </p>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

