import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const statuses = ["pending", "active", "failed", "disabled"];

export function DonationSubscriptionsFilters({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="p-4">
        <form className="grid gap-3 md:grid-cols-[1fr_0.35fr_auto_auto] md:items-end">
          <input type="hidden" name="limit" value={searchParams?.limit || "10"} />
          <label className="grid gap-2 text-sm font-medium">
            Search
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchParams?.q || ""}
                placeholder="Donor, email, campaign, plan, subscription..."
                className="pl-9"
              />
            </div>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Status
            <select
              name="status"
              defaultValue={searchParams?.status || ""}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm capitalize outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status} className="capitalize">
                  {status}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/donations/subscriptions">Reset</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
