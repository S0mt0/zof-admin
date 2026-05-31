import { CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination-v2";
import { Table } from "@/components/ui/table";

import { DonationTableSearchParams } from "./donation-table.types";
import { DonationTableBody } from "./donation-table-body";
import { DonationTableHead } from "./donation-table-head";

export function DonationCardBody({
  donations,
  pagination,
  searchParams,
  selectedIds,
  allCurrentSelected,
  someCurrentSelected,
  isPending,
  onToggleSelected,
  onToggleCurrentPage,
  onViewDonation,
  onDeleteDonation,
  onSendReceipt,
  onSendThankYou,
}: {
  donations: Donation[];
  pagination: Paginated<Donation>["pagination"];
  searchParams?: DonationTableSearchParams;
  selectedIds: string[];
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
  isPending: boolean;
  onToggleSelected: (id: string) => void;
  onToggleCurrentPage: () => void;
  onViewDonation: (donation: Donation) => void;
  onDeleteDonation: (id: string) => void;
  onSendReceipt: (id: string) => void;
  onSendThankYou: (id: string) => void;
}) {
  const serialBase = (pagination.page - 1) * pagination.limit;

  return (
    <CardContent className="overflow-x-auto">
      <Table>
        <DonationTableHead
          allCurrentSelected={allCurrentSelected}
          someCurrentSelected={someCurrentSelected}
          onToggleCurrentPage={onToggleCurrentPage}
        />
        <DonationTableBody
          donations={donations}
          selectedIds={selectedIds}
          serialBase={serialBase}
          isPending={isPending}
          onToggleSelected={onToggleSelected}
          onViewDonation={onViewDonation}
          onDeleteDonation={onDeleteDonation}
          onSendReceipt={onSendReceipt}
          onSendThankYou={onSendThankYou}
        />
      </Table>

      <Pagination
        pathname="/donations/manage"
        searchParams={searchParams as Record<string, string>}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        showingStart={(pagination.page - 1) * pagination.limit + 1}
        showingEnd={Math.min(pagination.page * pagination.limit, pagination.total)}
        totalItems={pagination.total}
        itemName="donations"
        limit={pagination.limit}
      />
    </CardContent>
  );
}
