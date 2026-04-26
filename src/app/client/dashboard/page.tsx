"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
type Listing = { id: string; title: string; status: string; updated_at: string; packages?: { name?: string } };
type Notification = { id: string; title: string; message: string; type: "info" | "success" | "warning" };

export default function ClientDashboardPage() {
  const [ads, setAds] = React.useState<Listing[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/client/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setAds(data.ads ?? []);
        setNotifications(data.notifications ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    drafts: ads.filter((a) => a.status === "draft").length,
    inReview: ads.filter((a) => a.status === "under_review").length,
    active: ads.filter((a) => a.status === "published").length,
    expired: ads.filter((a) => a.status === "expired").length,
  };
  const drafts = ads.filter((a) => a.status === "draft");
  const underReview = ads.filter((a) => a.status === "under_review");
  const activeAds = ads.filter((a) => a.status === "published");

  function ListingTable({ rows }: { rows: Listing[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Package</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell className="font-medium">{ad.title}</TableCell>
              <TableCell>
                <Badge variant={ad.status === "published" ? "default" : "secondary"}>{ad.status}</Badge>
              </TableCell>
              <TableCell>{ad.packages?.name ?? "-"}</TableCell>
              <TableCell className="text-right text-muted-foreground">
                {new Date(ad.updated_at).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Drafts", value: stats.drafts },
          { label: "In review", value: stats.inReview },
          { label: "Active", value: stats.active },
          { label: "Expired", value: stats.expired },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-2xl font-semibold">{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">Your listings</p>
          <p className="text-sm text-muted-foreground">
            Draft → Submitted → Under Review → Payment Pending → Payment Verified → Scheduled → Published → Expired
          </p>
        </div>
        <Button asChild>
          <Link href="/client/ads/new">Create ad</Link>
        </Button>
      </div>

      <Card className="mt-4 overflow-hidden p-4">
        {loading ? (
          <div className="grid gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-3">
                <Skeleton className="h-8 rounded-lg skeleton-sheen" />
                <Skeleton className="h-8 rounded-lg skeleton-sheen" />
                <Skeleton className="h-8 rounded-lg skeleton-sheen" />
                <Skeleton className="h-8 rounded-lg skeleton-sheen" />
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({ads.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({drafts.length})</TabsTrigger>
              <TabsTrigger value="review">Under review ({underReview.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeAds.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-3">
              {ads.length ? (
                <ListingTable rows={ads} />
              ) : (
                <div className="rounded-xl border p-6 text-sm text-muted-foreground">No listings yet.</div>
              )}
            </TabsContent>
            <TabsContent value="drafts" className="mt-3">
              {drafts.length ? (
                <ListingTable rows={drafts} />
              ) : (
                <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                  No drafts saved yet. Use “Create ad” and click “Save draft”.
                </div>
              )}
            </TabsContent>
            <TabsContent value="review" className="mt-3">
              {underReview.length ? (
                <ListingTable rows={underReview} />
              ) : (
                <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                  No ads currently in moderation review.
                </div>
              )}
            </TabsContent>
            <TabsContent value="active" className="mt-3">
              {activeAds.length ? (
                <ListingTable rows={activeAds} />
              ) : (
                <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                  No active ads yet. Once approved and published, they appear here.
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </Card>

      <div className="mt-6">
        <p className="text-sm font-semibold">Notifications</p>
        <div className="mt-3 grid gap-3">
          {notifications.length === 0 ? (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                No new notifications. Expiry reminders and review updates appear here.
              </p>
            </Card>
          ) : (
            notifications.map((n) => (
              <Card key={n.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  </div>
                  <Badge variant={n.type === "success" ? "default" : "secondary"}>{n.type}</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

