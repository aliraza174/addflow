"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenue = [
  { month: "Jan", basic: 120, standard: 240, premium: 380 },
  { month: "Feb", basic: 180, standard: 310, premium: 420 },
  { month: "Mar", basic: 160, standard: 290, premium: 510 },
  { month: "Apr", basic: 210, standard: 360, premium: 640 },
];

export default function AnalyticsPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total ads", value: 286 },
          { label: "Active", value: 42 },
          { label: "Approval rate", value: "78%" },
          { label: "Verified revenue", value: "$4,920" },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-2xl font-semibold">{m.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Revenue by package</p>
            <p className="text-sm text-muted-foreground">Mock chart (wired to DB later).</p>
          </div>
          <Badge variant="secondary">Last 4 months</Badge>
        </div>

        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="basic" stackId="a" fill="hsl(var(--chart-3))" />
              <Bar dataKey="standard" stackId="a" fill="hsl(var(--chart-2))" />
              <Bar dataKey="premium" stackId="a" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

