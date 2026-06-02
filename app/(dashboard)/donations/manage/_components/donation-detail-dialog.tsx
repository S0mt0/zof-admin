import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  formatBoolean,
  formatDateTime,
  formatMetadata,
  money,
} from "./donation-table.utils";

export function DonationDetailDialog({
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
            Full record for {donorName} · <strong>{donation.reference}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-3">
            <DetailItem
              label="Amount"
              value={money(donation.amount, donation.currency)}
            />
            <DetailItem
              label="Status"
              value={donation.status}
              className="capitalize"
            />
            <DetailItem
              label="Method"
              value={donation.method || "-"}
              className="capitalize"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Donor" value={donorName} />
            <DetailItem label="Email" value={donation.email || "-"} />
            <DetailItem label="Phone" value={donation.phone || "-"} />
            <DetailItem
              label="Campaign"
              value={donation.campaign?.topic || "Where needed most"}
            />
            <DetailItem
              label="Frequency"
              value={donation.frequency}
              className="capitalize"
            />
            <DetailItem
              label="Recurring"
              value={formatBoolean(donation.recurring)}
            />
            {donation.recurring ? (
              <div className="min-w-0 rounded-lg border bg-background p-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Subscription
                </p>
                {donation.subscriptionId ? (
                  <Link
                    href={`/donations/subscriptions?q=${donation.subscription?.paystackSubscriptionCode || donation.subscription?.paystackPlanCode || donation.subscriptionId}`}
                    className="mt-1 inline-flex break-all text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {donation.subscription?.paystackSubscriptionCode ||
                      donation.subscription?.paystackPlanCode ||
                      donation.subscriptionId}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm font-medium text-foreground">-</p>
                )}
              </div>
            ) : null}
            <DetailItem
              label="Anonymous"
              value={formatBoolean(donation.anonymous)}
            />
            <DetailItem
              label="Receipt enabled"
              value={formatBoolean(donation.sendReceipt)}
            />
            <DetailItem
              label="Thank-you enabled"
              value={formatBoolean(donation.sendThankYou)}
            />
            <DetailItem
              label="Paystack status"
              value={donation.paystackStatus || "-"}
            />
            {donation.paystackStatus?.toLowerCase() !== "success" ? (
              <DetailItem label="Server status" value={donation.status} />
            ) : null}

            {donation.paystackStatus?.toLowerCase() !== "success" &&
            donation.failReason ? (
              <DetailItem label="Failure reason" value={donation.failReason} />
            ) : null}
            <DetailItem
              label="Paid at"
              value={donation.paidAt ? formatDateTime(donation.paidAt) : "-"}
            />
            <DetailItem
              label="Created at"
              value={formatDateTime(donation.createdAt)}
            />
            <DetailItem
              label="Updated at"
              value={formatDateTime(donation.updatedAt)}
            />
            <DetailItem
              label="Campaign ID"
              value={donation.campaignId || "-"}
            />
            <DetailItem
              label="Access code"
              value={donation.accessCode || "-"}
            />
            <DetailItem label="Reference" value={donation.reference} />
          </div>

          <div className="grid gap-2 rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Notes
            </p>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {donation.notes || "No notes provided."}
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Metadata
            </p>
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
      <p
        className={`mt-1 break-words text-sm font-medium text-foreground ${className}`}
      >
        {value}
      </p>
    </div>
  );
}
