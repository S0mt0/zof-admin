import { Eye, Mail, Receipt, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

import { formatDateTime, getStatusVariant, money } from "./donation-table.utils";

export function DonationTableBody({
  donations,
  selectedIds,
  serialBase,
  isPending,
  onToggleSelected,
  onViewDonation,
  onDeleteDonation,
  onSendReceipt,
  onSendThankYou,
}: {
  donations: Donation[];
  selectedIds: string[];
  serialBase: number;
  isPending: boolean;
  onToggleSelected: (id: string) => void;
  onViewDonation: (donation: Donation) => void;
  onDeleteDonation: (id: string) => void;
  onSendReceipt: (id: string) => void;
  onSendThankYou: (id: string) => void;
}) {
  if (!donations.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={12} className="h-28 text-center text-muted-foreground">
            No donations match the current view.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {donations.map((donation, index) => (
        <TableRow
          key={donation.id}
          onClick={() => onViewDonation(donation)}
          className="cursor-pointer"
        >
          <TableCell onClick={(event) => event.stopPropagation()}>
            <Checkbox
              checked={selectedIds.includes(donation.id)}
              onCheckedChange={() => onToggleSelected(donation.id)}
              aria-label={`Select donation ${serialBase + index + 1}`}
            />
          </TableCell>
          <TableCell className="font-mono text-xs text-muted-foreground">
            {serialBase + index + 1}
          </TableCell>
          <TableCell>
            <div className="font-medium">
              {donation.anonymous ? "Anonymous" : donation.donor || "Unknown donor"}
            </div>
            <div className="text-xs text-muted-foreground">
              {donation.email || "No email"}
            </div>
          </TableCell>
          <TableCell className="whitespace-nowrap text-sm">{donation.phone || "-"}</TableCell>
          <TableCell className="whitespace-nowrap font-medium">
            {money(donation.amount, donation.currency)}
          </TableCell>
          <TableCell className="capitalize">{donation.frequency}</TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(donation.status)}>{donation.status}</Badge>
          </TableCell>
          <TableCell>{donation.campaign?.topic || "Where needed most"}</TableCell>
          <TableCell className="font-mono text-xs">{donation.reference}</TableCell>
          <TableCell className="capitalize">{donation.method}</TableCell>
          <TableCell className="whitespace-nowrap">
            {formatDateTime(donation.paidAt || donation.createdAt)}
          </TableCell>
          <TableCell onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={isPending}
                onClick={() => onViewDonation(donation)}
                title="View donation details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={isPending || !donation.email || donation.status !== "completed"}
                onClick={() => onSendReceipt(donation.id)}
                title="Send receipt"
              >
                <Receipt className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={isPending || !donation.email || donation.status !== "completed"}
                onClick={() => onSendThankYou(donation.id)}
                title="Send thank-you"
              >
                <Mail className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                disabled={isPending}
                onClick={() => onDeleteDonation(donation.id)}
                title="Delete donation"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
