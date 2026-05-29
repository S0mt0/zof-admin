"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  Download,
  FileText,
  Mail,
  Receipt,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteDonationAction,
  sendDonationReceiptAction,
  sendDonationThankYouAction,
  sendDonationsExportAction,
} from "@/lib/actions/pages/donations";
import { showActionResult } from "@/lib/utils/pages";
import { Pagination } from "@/components/ui/pagination-v2";

const money = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

interface DonationsTableProps extends Paginated<Donation> {
  searchParams?: Record<string, string>;
}

export function DonationsTable({
  data: donations,
  pagination,
  searchParams,
}: DonationsTableProps) {
  const [isPending, startTransition] = useTransition();

  const run = (action: Promise<any>, fallback: string) => {
    startTransition(() => {
      action
        .then(showActionResult(fallback))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this donation record?")) return;
    run(deleteDonationAction(id), "Donation deleted");
  };

  const downloadExport = (format: "pdf" | "csv") => {
    window.location.href = `/api/donations/export?format=${format}`;
  };

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Donation records</CardTitle>
          <CardDescription>
            Track donations, send emails, and export records.
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!pagination.total || isPending}>
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
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.length ? (
              donations.map((donation) => (
                <TableRow key={donation.id}>
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
                  <TableCell>
                    {money(donation.amount, donation.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        donation.status === "completed"
                          ? "default"
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
                  <TableCell>
                    {format(new Date(donation.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isPending || !donation.email}
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
                        disabled={isPending || !donation.email}
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
                        onClick={() => remove(donation.id)}
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
                  colSpan={7}
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
  );
}
