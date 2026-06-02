import { Activity, CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { DonationSummary } from "./donation-table.types";
import { money } from "./donation-table.utils";

const statItems = (summary: DonationSummary) => [
  {
    label: "Total records",
    value: summary.total.toLocaleString(),
    detail: money(summary.totalAmount),
    icon: Activity,
  },
  {
    label: "Success",
    value: summary.success.toLocaleString(),
    detail: money(summary.successAmount),
    icon: CheckCircle2,
  },
  {
    label: "Pending / Ongoing",
    value: (summary.pending + summary.ongoing).toLocaleString(),
    detail: `${summary.pending} pending · ${summary.ongoing} ongoing`,
    icon: Clock3,
  },
  {
    label: "Not completed",
    value: (summary.failed + summary.abandoned + summary.reversed).toLocaleString(),
    detail: `${summary.failed} failed · ${summary.abandoned} abandoned · ${summary.reversed} reversed`,
    icon: XCircle,
  },
];

export function DonationStatsPanel({
  summary,
  hasActiveFilters,
}: {
  summary: DonationSummary;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statItems(summary).map(({ label, value, detail, icon: Icon }) => (
        <Card key={label} className="overflow-hidden border-border/70">
          <CardContent className="flex items-start gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{detail}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <p className="sm:col-span-2 xl:col-span-4 text-xs text-muted-foreground">
        {hasActiveFilters
          ? "Summary is calculated from all donation records matching the active filters."
          : "Summary is calculated from every donation record in the database."}
      </p>
    </div>
  );
}
