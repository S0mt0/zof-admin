"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Mail,
  Receipt,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination-v2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteDonationAction,
  deleteDonationsAction,
  sendDonationReceiptAction,
  sendDonationThankYouAction,
  sendDonationsExportAction,
} from "@/lib/actions/pages/donations";
import { showActionResult } from "@/lib/utils/pages";

const money = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDateTime = (value?: Date | string | null) =>
  new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value || Date.now()));

const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

const formatMetadata = (value: unknown) => {
  if (!value) return "-";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

interface DonationsTableProps extends Paginated<Donation> {
  searchParams?: Record<string, string>;
}

type DeleteTarget = { type: "single"; id: string } | { type: "bulk" } | null;

export function DonationsTable({
  data: donations,
  pagination,
  searchParams,
}: DonationsTableProps) {
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

  const serialBase = (pagination.page - 1) * pagination.limit;

  return (
    <>
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Donation records</CardTitle>
            <CardDescription>
              Track donations, send emails, and export records.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCount ? (
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={() => setDeleteTarget({ type: "bulk" })}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete selected ({selectedCount})
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!pagination.total || isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Download</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => downloadExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDF file
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadExport("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV file
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Email to me</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    run(sendDonationsExportAction("pdf"), "PDF export sent")
                  }
                >
                  <Send className="mr-2 h-4 w-4" />
                  PDF attachment
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    run(sendDonationsExportAction("csv"), "CSV export sent")
                  }
                >
                  <Mail className="mr-2 h-4 w-4" />
                  CSV attachment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={
                      allCurrentSelected ||
                      (someCurrentSelected ? "indeterminate" : false)
                    }
                    onCheckedChange={toggleCurrentPage}
                    aria-label="Select current page donations"
                  />
                </TableHead>
                <TableHead className="w-14">S/N</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length ? (
                donations.map((donation, index) => (
                  <TableRow key={donation.id} onClick={() => setDetailTarget(donation)} className="cursor-pointer">
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(donation.id)}
                        onCheckedChange={() => toggleSelected(donation.id)}
                        aria-label={`Select donation ${serialBase + index + 1}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {serialBase + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {donation.anonymous
                          ? "Anonymous"
                          : donation.donor || "Unknown donor"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {donation.email || "No email"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {donation.phone || "-"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {money(donation.amount, donation.currency)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {donation.frequency}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          donation.status === "completed"
                            ? "default"
                            : donation.status === "failed"
                            ? "destructive"
                            : donation.status === "cancelled"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {donation.campaign?.topic || "Where needed most"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {donation.reference}
                    </TableCell>
                    <TableCell className="capitalize">
                      {donation.method}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(donation.paidAt || donation.createdAt)}
                    </TableCell>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isPending}
                          onClick={() => setDetailTarget(donation)}
                          title="View donation details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={
                            isPending ||
                            !donation.email ||
                            donation.status !== "completed"
                          }
                          onClick={() =>
                            run(
                              sendDonationReceiptAction(donation.id),
                              "Receipt sent"
                            )
                          }
                          title="Send receipt"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={
                            isPending ||
                            !donation.email ||
                            donation.status !== "completed"
                          }
                          onClick={() =>
                            run(
                              sendDonationThankYouAction(donation.id),
                              "Thank-you sent"
                            )
                          }
                          title="Send thank-you"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={isPending}
                          onClick={() =>
                            setDeleteTarget({ type: "single", id: donation.id })
                          }
                          title="Delete donation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="h-28 text-center text-muted-foreground"
                  >
                    No donations yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination
            pathname="/donations/manage"
            searchParams={searchParams}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            showingStart={(pagination.page - 1) * pagination.limit + 1}
            showingEnd={Math.min(
              pagination.page * pagination.limit,
              pagination.total
            )}
            totalItems={pagination.total}
            itemName="donations"
            limit={pagination.limit}
          />
        </CardContent>
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
    </>
  );
}

function DonationDetailDialog({
  donation,
  open,
  onOpenChange,
}: {
  donation: Donation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!donation) return null;

  const donorName = donation.anonymous
    ? "Anonymous"
    : donation.donor || "Unknown donor";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Donation details</DialogTitle>
          <DialogDescription>
            Full record for {donorName} · {donation.reference}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-3">
            <DetailItem label="Amount" value={money(donation.amount, donation.currency)} />
            <DetailItem label="Status" value={donation.status} className="capitalize" />
            <DetailItem label="Method" value={donation.method || "-"} className="capitalize" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Donor" value={donorName} />
            <DetailItem label="Email" value={donation.email || "-"} />
            <DetailItem label="Phone" value={donation.phone || "-"} />
            <DetailItem label="Campaign" value={donation.campaign?.topic || "Where needed most"} />
            <DetailItem label="Frequency" value={donation.frequency} className="capitalize" />
            <DetailItem label="Recurring" value={formatBoolean(donation.recurring)} />
            <DetailItem label="Anonymous" value={formatBoolean(donation.anonymous)} />
            <DetailItem label="Receipt enabled" value={formatBoolean(donation.sendReceipt)} />
            <DetailItem label="Thank-you enabled" value={formatBoolean(donation.sendThankYou)} />
            <DetailItem label="Paystack status" value={donation.paystackStatus || "-"} />
            <DetailItem label="Paid at" value={donation.paidAt ? formatDateTime(donation.paidAt) : "-"} />
            <DetailItem label="Created at" value={formatDateTime(donation.createdAt)} />
            <DetailItem label="Updated at" value={formatDateTime(donation.updatedAt)} />
            <DetailItem label="Campaign ID" value={donation.campaignId || "-"} />
            <DetailItem label="Access code" value={donation.accessCode || "-"} />
            <DetailItem label="Reference" value={donation.reference} />
          </div>

          <div className="grid gap-2 rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Notes</p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {donation.notes || "No notes provided."}
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Metadata</p>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs leading-6 text-muted-foreground">
              {formatMetadata(donation.metadata)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 break-words text-sm font-medium text-foreground ${className}`}>
        {value}
      </p>
    </div>
  );
}
