"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { Card } from "@/components/ui/card";
import {
  deleteDonationAction,
  deleteDonationsAction,
  sendDonationReceiptAction,
  sendDonationThankYouAction,
  sendDonationsExportAction,
  syncUnresolvedDonationsAction,
} from "@/lib/actions/pages/donations";
import { showActionResult } from "@/lib/utils/pages";

import { DonationCardBody } from "./donation-card-body";
import { DonationCardHeader } from "./donation-card-header";
import { DonationDetailDialog } from "./donation-detail-dialog";
import { DonationFilters } from "./donation-filters";
import { DonationStatsPanel } from "./donation-stats-panel";
import {
  DeleteTarget,
  DonationSummary,
  DonationTableSearchParams,
} from "./donation-table.types";

interface DonationsTableProps extends Paginated<Donation> {
  campaigns: DonationCampaign[];
  summary: DonationSummary;
  hasActiveFilters: boolean;
  searchParams?: DonationTableSearchParams;
}

export function DonationsTable({
  data: donations,
  pagination,
  campaigns,
  summary,
  hasActiveFilters,
  searchParams,
}: DonationsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [detailTarget, setDetailTarget] = useState<Donation | null>(null);

  const selectedCount = selectedIds.length;
  const allCurrentSelected =
    donations.length > 0 &&
    donations.every((donation) => selectedIds.includes(donation.id));
  const someCurrentSelected = donations.some((donation) =>
    selectedIds.includes(donation.id)
  );

  const dialogMessage = useMemo(() => {
    if (!deleteTarget) return "";
    if (deleteTarget.type === "bulk") {
      return `Delete ${selectedCount} selected donation${
        selectedCount === 1 ? "" : "s"
      }? This action cannot be undone.`;
    }
    return "Delete this donation record? This action cannot be undone.";
  }, [deleteTarget, selectedCount]);

  const run = (action: Promise<any>, fallback: string, onDone?: () => void) => {
    startTransition(() => {
      action
        .then((result) => {
          showActionResult(fallback)(result);
          if (!("error" in result)) onDone?.();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleCurrentPage = () => {
    const pageIds = donations.map((donation) => donation.id);
    setSelectedIds((current) => {
      if (allCurrentSelected) {
        return current.filter((id) => !pageIds.includes(id));
      }
      return Array.from(new Set([...current, ...pageIds]));
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "single") {
      run(deleteDonationAction(deleteTarget.id), "Donation deleted", () => {
        setSelectedIds((current) =>
          current.filter((id) => id !== deleteTarget.id)
        );
        setDeleteTarget(null);
      });
      return;
    }

    run(deleteDonationsAction(selectedIds), "Donations deleted", () => {
      setSelectedIds([]);
      setDeleteTarget(null);
    });
  };

  const downloadExport = (format: "pdf" | "csv") => {
    window.location.href = `/api/donations/export?format=${format}`;
  };

  return (
    <div className="grid gap-4">
      <DonationStatsPanel
        summary={summary}
        hasActiveFilters={hasActiveFilters}
      />
      <DonationFilters campaigns={campaigns} searchParams={searchParams} />

      <Card>
        <DonationCardHeader
          selectedCount={selectedCount}
          total={pagination.total}
          isPending={isPending}
          onDeleteSelected={() => setDeleteTarget({ type: "bulk" })}
          onDownloadExport={downloadExport}
          onEmailExport={(format) =>
            run(
              sendDonationsExportAction(format),
              `${format.toUpperCase()} export sent`
            )
          }
          onSync={() =>
            run(syncUnresolvedDonationsAction(), "Donation statuses synced", () =>
              router.refresh()
            )
          }
        />
        <DonationCardBody
          donations={donations}
          pagination={pagination}
          searchParams={searchParams}
          selectedIds={selectedIds}
          allCurrentSelected={allCurrentSelected}
          someCurrentSelected={someCurrentSelected}
          isPending={isPending}
          onToggleSelected={toggleSelected}
          onToggleCurrentPage={toggleCurrentPage}
          onViewDonation={setDetailTarget}
          onDeleteDonation={(id) => setDeleteTarget({ type: "single", id })}
          onSendReceipt={(id) =>
            run(sendDonationReceiptAction(id), "Receipt sent")
          }
          onSendThankYou={(id) =>
            run(sendDonationThankYouAction(id), "Thank-you sent")
          }
        />
      </Card>

      <DonationDetailDialog
        donation={detailTarget}
        open={Boolean(detailTarget)}
        onOpenChange={(open) => {
          if (!open) setDetailTarget(null);
        }}
      />

      <AlertDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        onOk={confirmDelete}
        message={dialogMessage}
        isPending={isPending}
      />
    </div>
  );
}
