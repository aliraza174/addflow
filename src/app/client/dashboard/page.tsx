import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const demoAds = [
  { title: "Logo design for startups", status: "Draft", package: "Standard", updated: "2h ago" },
  { title: "Apartment for rent • DHA", status: "Under Review", package: "Premium", updated: "1d ago" },
  { title: "iPhone 14 Pro • Like new", status: "Payment Pending", package: "Basic", updated: "3d ago" },
  { title: "Cleaning services • Weekly", status: "Published", package: "Premium", updated: "5d ago" },
  { title: "Web dev contract • Remote", status: "Expired", package: "Standard", updated: "22d ago" },
];

export default async function ClientDashboardPage() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Drafts", value: 2 },
          { label: "In review", value: 1 },
          { label: "Active", value: 1 },
          { label: "Expired", value: 1 },
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

      <Card className="mt-4 overflow-hidden">
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
            {demoAds.map((ad) => (
              <TableRow key={ad.title}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>
                  <Badge variant={ad.status === "Published" ? "default" : "secondary"}>{ad.status}</Badge>
                </TableCell>
                <TableCell>{ad.package}</TableCell>
                <TableCell className="text-right text-muted-foreground">{ad.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

