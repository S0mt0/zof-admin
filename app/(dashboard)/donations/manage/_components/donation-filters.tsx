import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { DonationTableSearchParams } from "./donation-table.types";

const statuses: DonationStatus[] = [
  "pending",
  "completed",
  "failed",
  "refunded",
  "cancelled",
];

export function DonationFilters({
  campaigns,
  searchParams,
}: {
  campaigns: DonationCampaign[];
  searchParams?: DonationTableSearchParams;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="p-4">
        <form className="grid gap-3 lg:grid-cols-[1.5fr_0.9fr_0.9fr_0.8fr_0.75fr_auto_auto] lg:items-end">
          <input type="hidden" name="limit" value={searchParams?.limit || "15"} />
          <label className="grid gap-2 text-sm font-medium">
            Search
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchParams?.q || ""}
                placeholder="Reference, donor, email, phone..."
                className="pl-9"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Campaign
            <select
              name="campaign"
              defaultValue={searchParams?.campaign || ""}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All campaigns</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.topic}
                </option>
              ))}
            </select>
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

          <label className="grid gap-2 text-sm font-medium">
            Order by
            <select
              name="sort"
              defaultValue={searchParams?.sort || "date"}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Direction
            <select
              name="direction"
              defaultValue={searchParams?.direction || "desc"}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>

          <Button type="submit" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/donations/manage">Reset</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
