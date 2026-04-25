"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const jobs = [
  { name: "Publish scheduled ads", cadence: "hourly", lastRun: "12m ago", status: "ok" },
  { name: "Expire outdated ads", cadence: "daily", lastRun: "6h ago", status: "ok" },
  { name: "Expiring-soon notifications", cadence: "hourly", lastRun: "1h ago", status: "warn" },
  { name: "DB heartbeat", cadence: "15m", lastRun: "3m ago", status: "ok" },
];

export default function SystemHealthPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">DB heartbeat</p>
          <p className="mt-2 text-2xl font-semibold">Healthy</p>
          <p className="mt-1 text-sm text-muted-foreground">Last check 3m ago</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Cron success rate</p>
          <p className="mt-2 text-2xl font-semibold">99.2%</p>
          <p className="mt-1 text-sm text-muted-foreground">7-day window</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Failed validations</p>
          <p className="mt-2 text-2xl font-semibold">4</p>
          <p className="mt-1 text-sm text-muted-foreground">Media URL issues</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div>
            <p className="font-semibold">Automation jobs</p>
            <p className="text-sm text-muted-foreground">
              Scheduled publishing, expiry, notifications, and heartbeat checks.
            </p>
          </div>
          <Badge variant="secondary">Mock data</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Cadence</TableHead>
              <TableHead>Last run</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((j) => (
              <TableRow key={j.name}>
                <TableCell className="font-medium">{j.name}</TableCell>
                <TableCell>{j.cadence}</TableCell>
                <TableCell className="text-muted-foreground">{j.lastRun}</TableCell>
                <TableCell>
                  <Badge variant={j.status === "ok" ? "default" : "secondary"}>{j.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

