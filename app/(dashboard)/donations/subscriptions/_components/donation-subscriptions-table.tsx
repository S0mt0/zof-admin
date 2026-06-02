import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination-v2";

import { DonationSubscriptionsFilters } from "./donation-subscriptions-filters";
import { DonationSubscriptionsTableBody } from "./donation-subscriptions-table-body";
import { DonationSubscriptionsTableHead } from "./donation-subscriptions-table-head";

export function DonationSubscriptionsTable({
  data,
  pagination,
  searchParams,
}: {
  data: DonationSubscription[];
  pagination: Paginated<DonationSubscription>["pagination"];
  searchParams?: Record<string, string>;
}) {
  const serialBase = (pagination.page - 1) * pagination.limit;

  return (
    <div className="grid gap-4">
      <DonationSubscriptionsFilters searchParams={searchParams} />
      <Card>
        <CardHeader>
          <CardTitle>Recurring donations</CardTitle>
          <CardDescription>
            Track recurring donor commitments, Paystack subscription codes, and current subscription status.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <DonationSubscriptionsTableHead />
            <DonationSubscriptionsTableBody
              subscriptions={data}
              serialBase={serialBase}
            />
          </Table>
          <Pagination
            pathname="/donations/subscriptions"
            searchParams={searchParams}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            showingStart={(pagination.page - 1) * pagination.limit + 1}
            showingEnd={Math.min(pagination.page * pagination.limit, pagination.total)}
            totalItems={pagination.total}
            itemName="subscriptions"
            limit={pagination.limit}
          />
        </CardContent>
      </Card>
    </div>
  );
}
