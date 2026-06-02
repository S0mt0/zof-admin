import { Badge } from "@/components/ui/badge";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  formatDateTime,
  money,
} from "../../manage/_components/donation-table.utils";

type EnrichedSubscription = DonationSubscription & {
  paystackLiveStatus?: string;
  paystackNextPaymentDate?: string;
};

const statusClassName = (status: string) => {
  if (status === "active") return "bg-emerald-600 text-white hover:bg-emerald-600/90";
  if (status === "pending") return "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50";
  if (status === "disabled") return "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-50";
  return "bg-red-600 text-white hover:bg-red-600/90";
};

export function DonationSubscriptionsTableBody({
  subscriptions,
  serialBase,
}: {
  subscriptions: EnrichedSubscription[];
  serialBase: number;
}) {
  if (!subscriptions.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9} className="h-28 text-center text-muted-foreground">
            No recurring donations match this view.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {subscriptions.map((subscription, index) => {
        const liveStatus = subscription.paystackLiveStatus || subscription.status;

        return (
          <TableRow key={subscription.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {serialBase + index + 1}
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {subscription.anonymous ? "Anonymous" : subscription.donor || "Unknown donor"}
              </div>
              <div className="text-xs text-muted-foreground">
                {subscription.email}
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap font-medium">
              {money(subscription.amount, subscription.currency)}
            </TableCell>
            <TableCell className="capitalize">{subscription.frequency}</TableCell>
            <TableCell>
              <Badge className={statusClassName(String(liveStatus).toLowerCase())}>
                {String(liveStatus).toLowerCase()}
              </Badge>
            </TableCell>
            <TableCell>{subscription.campaign?.topic || "Where needed most"}</TableCell>
            <TableCell className="font-mono text-xs">{subscription.paystackPlanCode}</TableCell>
            <TableCell className="font-mono text-xs">
              {subscription.paystackSubscriptionCode || "-"}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatDateTime(subscription.createdAt)}
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
