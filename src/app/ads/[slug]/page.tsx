import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublishedAdBySlugFromDb } from "@/lib/supabase/queries";
import { getSession } from "@/lib/auth/mock-session";
import { MediaCarousel } from "@/components/ui/media-carousel";

export default async function AdDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  
  const session = await getSession();
  const isAuthenticated = !!session;

  const ad = await getPublishedAdBySlugFromDb(slug);
  if (!ad) notFound();

  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              <Link href="/explore" className="hover:text-foreground">
                Explore
              </Link>{" "}
              / <span className="text-foreground">{slug}</span>
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{ad.title}</h1>
            {ad.price && (
              <p className="text-2xl font-bold mt-2" suppressHydrationWarning>${ad.price.toLocaleString()} {ad.negotiable && <span className="text-sm font-normal text-muted-foreground">(Negotiable)</span>}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Save</Button>
            <Button variant="outline">Share</Button>
            <Button variant="ghost" className="text-destructive">Report</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="grid gap-6">
            {!isAuthenticated ? (
              <Card className="overflow-hidden relative bg-muted/30">
                <div className="aspect-video w-full relative">
                  <img className="w-full h-full object-cover blur-md scale-105" src={ad.media.thumbnailUrl} alt={ad.title} />
                  <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">Login required to view full details</h2>
                    <p className="text-muted-foreground mb-4">You need to be signed in to see the description, photos, and contact the seller.</p>
                    <Button asChild>
                      <Link href={`/auth/login?next=/ads/${slug}`}>Login / Sign Up</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <MediaCarousel media={ad.media} gallery={ad.mediaGallery} />
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className="capitalize">{ad.package}</Badge>
                    <Badge variant="secondary">Verified listing</Badge>
                    <Badge variant="outline">City: {ad.city}</Badge>
                    <Badge variant="outline">Category: {ad.category}</Badge>
                    {ad.condition && <Badge variant="outline">Condition: {ad.condition}</Badge>}
                  </div>
                  
                  {ad.tags && ad.tags.length > 0 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {ad.tags.map(t => (
                        <span key={t} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">#{t}</span>
                      ))}
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-sm leading-7 text-muted-foreground whitespace-pre-line mb-8">
                    {ad.description}
                  </p>

                  {ad.attributes && Object.keys(ad.attributes).length > 0 && (
                    <>
                      <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        {Object.entries(ad.attributes).map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">{key}</span>
                            <span className="font-medium text-right">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="grid gap-4">
            <Card className="p-5">
              <p className="text-sm font-semibold">Seller Information</p>
              
              {!isAuthenticated ? (
                <div className="mt-4 flex flex-col items-center justify-center py-6 text-center bg-muted/30 rounded-md">
                  <p className="text-sm text-muted-foreground mb-4">Login to view seller details and contact info.</p>
                  <Button variant="outline" asChild>
                    <Link href={`/auth/login?next=/ads/${slug}`}>Unlock Details</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mt-4">
                    {ad.seller.avatarUrl ? (
                      <img src={ad.seller.avatarUrl} alt={ad.seller.displayName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {ad.seller.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{ad.seller.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {ad.seller.isVerified ? "✅ Verified Seller" : "Unverified Seller"} • {ad.seller.city}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <Button className="w-full" asChild>
                      <Link href={`/messages/new?to=${ad.seller.id}`}>Message on AdFlow</Link>
                    </Button>
                    {ad.seller.whatsappNumber && (
                      <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" asChild>
                        <a href={`https://wa.me/${ad.seller.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi, I am interested in your ad: ${ad.title}`} target="_blank" rel="noopener noreferrer">
                          WhatsApp
                        </a>
                      </Button>
                    )}
                    {ad.seller.publicEmail && (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${ad.seller.publicEmail}?subject=Regarding your ad: ${ad.title}`}>
                          Email Seller
                        </a>
                      </Button>
                    )}
                  </div>

                  {ad.seller.responseRate && (
                    <div className="mt-6 pt-4 border-t text-sm flex justify-between text-muted-foreground">
                      <span>Response Rate</span>
                      <span className="font-medium text-foreground">{ad.seller.responseRate}%</span>
                    </div>
                  )}
                  {ad.seller.responseTime && (
                    <div className="mt-2 text-sm flex justify-between text-muted-foreground">
                      <span>Response Time</span>
                      <span className="font-medium text-foreground capitalize">{ad.seller.responseTime}</span>
                    </div>
                  )}
                </>
              )}
            </Card>

            <Card className="p-5">
              <p className="text-sm font-semibold">Listing Details</p>
              <div className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Listing ID</span>
                  <span className="font-mono text-xs">{ad.id.split('-')[0]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Posted</span>
                  <span suppressHydrationWarning>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span suppressHydrationWarning>{ad.expireAt ? new Date(ad.expireAt).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Views</span>
                  <span>{ad.viewCount ?? 0}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
