"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type PaymentRow = {
  id: string;
  adTitle: string;
  amount: string;
  method: string;
  ref: string;
  status: "Payment Submitted" | "Verified" | "Rejected";
};

const seed: PaymentRow[] = [
  {
    id: "pay_201",
    adTitle: "Logo design for startups",
    amount: "$24",
    method: "Bank transfer",
    ref: "TRX-8891",
    status: "Payment Submitted",
  },
  {
    id: "pay_202",
    adTitle: "Apartment for rent • DHA",
    amount: "$59",
    method: "Easypaisa",
    ref: "EP-1245",
    status: "Payment Submitted",
  },
];

export default function AdminDashboardPage() {
  const [rows, setRows] = React.useState(seed);

  function verify(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Verified" } : r))
    );
    toast.success("Payment verified", { description: "Ad can be scheduled or published." });
  }

  function reject(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r))
    );
    toast.error("Payment rejected", { description: "Client will be notified with reason." });
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active ads", value: 42 },
          { label: "Pending review", value: 6 },
          { label: "Payment queue", value: rows.filter((r) => r.status === "Payment Submitted").length },
          { label: "Expiring soon", value: 3 },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-2xl font-semibold">{m.value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div>
            <p className="font-semibold">Payment verification queue</p>
            <p className="text-sm text-muted-foreground">
              Block duplicates by transaction reference and record audit logs.
            </p>
          </div>
          <Badge variant="secondary">{rows.length} records</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.adTitle}</TableCell>
                <TableCell>{r.amount}</TableCell>
                <TableCell>{r.method}</TableCell>
                <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "Verified" ? "default" : "secondary"}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => verify(r.id)}
                      disabled={r.status !== "Payment Submitted"}
                    >
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reject(r.id)}
                      disabled={r.status !== "Payment Submitted"}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

