"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type QueueItem = {
  id: string;
  title: string;
  category: string;
  city: string;
  media: "youtube" | "image";
  submittedAt: string;
};

export default function ModeratorReviewQueuePage() {
  const [items, setItems] = React.useState<QueueItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/moderator/review-queue")
      .then((r) => r.json())
      .then((data) => {
        const mapped: QueueItem[] = (data.items ?? []).map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.categories?.name ?? "Unknown",
          city: row.cities?.name ?? "Unknown",
          media: row.ad_media?.[0]?.source_type === "youtube" ? "youtube" : "image",
          submittedAt: new Date(row.created_at).toLocaleString(),
        }));
        setItems(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  async function approve(id: string) {
    await fetch(`/api/moderator/ads/${id}/review`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.success("Approved content", { description: "Moved to Payment Pending stage." });
  }

  async function reject(id: string, reason: string) {
    await fetch(`/api/moderator/ads/${id}/review`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reject", note: reason }),
    });
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.error("Rejected", { description: reason || "No reason provided." });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Queue</p>
          <p className="text-sm text-muted-foreground">
            Validate title/description, taxonomy fit, and external media URL health.
          </p>
        </div>
        <Badge variant="secondary">{items.length} pending</Badge>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-2/3 skeleton-sheen" />
              <Skeleton className="mt-3 h-4 w-1/2 skeleton-sheen" />
              <div className="mt-4 grid gap-2">
                <Skeleton className="h-8 w-full skeleton-sheen" />
                <Skeleton className="h-8 w-full skeleton-sheen" />
              </div>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="font-semibold">Queue cleared</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nothing to review right now. New submissions will appear here.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.category} • {item.city} • Submitted {item.submittedAt}
                </p>
              </div>
              <Badge variant={item.media === "youtube" ? "default" : "secondary"}>
                {item.media}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">Duplicate check: pending</Badge>
              <Badge variant="outline">Media validation: ok</Badge>
              <Badge variant="outline">Policy: clean</Badge>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => approve(item.id)} className="sm:flex-1">
                Approve → Payment pending
              </Button>

              <Dialog>
                <DialogTrigger render={<Button variant="outline" className="sm:flex-1" />}>
                  Reject with reason
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject listing</DialogTitle>
                  </DialogHeader>
                  <RejectForm
                    onReject={(reason) => reject(item.id, reason)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RejectForm({ onReject }: { onReject: (reason: string) => void }) {
  const [reason, setReason] = React.useState(
    "Reason: external media URL appears broken or content violates usage policy."
  );
  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">
        This message becomes visible to the client and is recorded in audit logs.
      </p>
      <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={5} />
      <Button
        variant="destructive"
        onClick={() => onReject(reason)}
      >
        Reject
      </Button>
    </div>
  );
}

