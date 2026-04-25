"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SuperSystemPage() {
  return (
    <div className="grid gap-4">
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold">System settings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Placeholder panel for packages, categories/cities activation, featured rules, and reports.
            </p>
          </div>
          <Badge variant="secondary">Super admin</Badge>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button variant="outline">Manage packages (next)</Button>
          <Button variant="outline">Manage categories (next)</Button>
          <Button variant="outline">Featured rules (next)</Button>
        </div>
      </Card>
    </div>
  );
}

