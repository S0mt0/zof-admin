import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DonationSubscriptionsTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-14">S/N</TableHead>
        <TableHead>Donor</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Frequency</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Campaign</TableHead>
        <TableHead>Plan code</TableHead>
        <TableHead>Subscription code</TableHead>
        <TableHead>Created</TableHead>
      </TableRow>
    </TableHeader>
  );
}
