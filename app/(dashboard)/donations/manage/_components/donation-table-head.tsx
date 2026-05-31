import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DonationTableHead({
  allCurrentSelected,
  someCurrentSelected,
  onToggleCurrentPage,
}: {
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
  onToggleCurrentPage: () => void;
}) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">
          <Checkbox
            checked={allCurrentSelected || (someCurrentSelected ? "indeterminate" : false)}
            onCheckedChange={onToggleCurrentPage}
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
  );
}
