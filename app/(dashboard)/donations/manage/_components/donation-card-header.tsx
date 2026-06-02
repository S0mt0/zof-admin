import {
  ChevronDown,
  Download,
  FileText,
  Mail,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DonationCardHeader({
  selectedCount,
  total,
  isPending,
  onDeleteSelected,
  onDownloadExport,
  onEmailExport,
  onSync,
}: {
  selectedCount: number;
  total: number;
  isPending: boolean;
  onDeleteSelected: () => void;
  onDownloadExport: (format: "pdf" | "csv") => void;
  onEmailExport: (format: "pdf" | "csv") => void;
  onSync: () => void;
}) {
  return (
    <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <CardTitle>Donation records</CardTitle>
        <CardDescription>
          Track donations, inspect records, send emails, and export data.
        </CardDescription>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCount ? (
          <Button variant="destructive" disabled={isPending} onClick={onDeleteSelected}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete selected ({selectedCount})
          </Button>
        ) : null}

        <Button variant="outline" disabled={isPending} onClick={onSync}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync status
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" disabled={!total || isPending}>
              <Download className="mr-2 h-4 w-4" />
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Download</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onDownloadExport("pdf")}>
              <FileText className="mr-2 h-4 w-4" />
              PDF file
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDownloadExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              CSV file
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Email to me</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEmailExport("pdf")}>
              <Send className="mr-2 h-4 w-4" />
              PDF attachment
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEmailExport("csv")}>
              <Mail className="mr-2 h-4 w-4" />
              CSV attachment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
  );
}
