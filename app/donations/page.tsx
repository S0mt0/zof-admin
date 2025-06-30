"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination } from "@/components/ui/pagination";
import {
  Plus,
  Search,
  MoreHorizontal,
  Download,
  Mail,
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  Filter,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Extended mock data for pagination testing
const allDonations = [
  {
    id: 1,
    donor: "Anonymous",
    email: "anonymous@donor.com",
    amount: 1000,
    date: "2024-01-15",
    method: "Credit Card",
    status: "completed",
    campaign: "General Fund",
    recurring: false,
  },
  {
    id: 2,
    donor: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    amount: 250,
    date: "2024-01-14",
    method: "PayPal",
    status: "completed",
    campaign: "Education Initiative",
    recurring: true,
  },
  {
    id: 3,
    donor: "Michael Chen",
    email: "michael.chen@email.com",
    amount: 500,
    date: "2024-01-12",
    method: "Bank Transfer",
    status: "pending",
    campaign: "Community Outreach",
    recurring: false,
  },
  {
    id: 4,
    donor: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    amount: 100,
    date: "2024-01-10",
    method: "Credit Card",
    status: "completed",
    campaign: "Health Workshop",
    recurring: true,
  },
  {
    id: 5,
    donor: "David Wilson",
    email: "david.wilson@email.com",
    amount: 750,
    date: "2024-01-08",
    method: "Bank Transfer",
    status: "completed",
    campaign: "Youth Program",
    recurring: false,
  },
  {
    id: 6,
    donor: "Lisa Brown",
    email: "lisa.brown@email.com",
    amount: 200,
    date: "2024-01-05",
    method: "Credit Card",
    status: "failed",
    campaign: "General Fund",
    recurring: false,
  },
  {
    id: 7,
    donor: "Robert Taylor",
    email: "robert.taylor@email.com",
    amount: 300,
    date: "2024-01-03",
    method: "PayPal",
    status: "completed",
    campaign: "Education Initiative",
    recurring: true,
  },
  {
    id: 8,
    donor: "Amanda Garcia",
    email: "amanda.garcia@email.com",
    amount: 150,
    date: "2024-01-01",
    method: "Credit Card",
    status: "pending",
    campaign: "Community Outreach",
    recurring: false,
  },
  {
    id: 9,
    donor: "James Lee",
    email: "james.lee@email.com",
    amount: 400,
    date: "2023-12-30",
    method: "Bank Transfer",
    status: "completed",
    campaign: "Health Workshop",
    recurring: false,
  },
  {
    id: 10,
    donor: "Jennifer Martinez",
    email: "jennifer.martinez@email.com",
    amount: 125,
    date: "2023-12-28",
    method: "PayPal",
    status: "completed",
    campaign: "General Fund",
    recurring: true,
  },
  {
    id: 11,
    donor: "Christopher Davis",
    email: "christopher.davis@email.com",
    amount: 600,
    date: "2023-12-25",
    method: "Credit Card",
    status: "completed",
    campaign: "Holiday Drive",
    recurring: false,
  },
  {
    id: 12,
    donor: "Michelle Thompson",
    email: "michelle.thompson@email.com",
    amount: 175,
    date: "2023-12-20",
    method: "Bank Transfer",
    status: "completed",
    campaign: "Education Initiative",
    recurring: true,
  },
  {
    id: 13,
    donor: "Daniel Martinez",
    email: "daniel.martinez@email.com",
    amount: 350,
    date: "2023-12-18",
    method: "PayPal",
    status: "failed",
    campaign: "Community Outreach",
    recurring: false,
  },
  {
    id: 14,
    donor: "Patricia Moore",
    email: "patricia.moore@email.com",
    amount: 225,
    date: "2023-12-15",
    method: "Credit Card",
    status: "completed",
    campaign: "Youth Program",
    recurring: false,
  },
  {
    id: 15,
    donor: "Thomas Anderson",
    email: "thomas.anderson@email.com",
    amount: 800,
    date: "2023-12-10",
    method: "Bank Transfer",
    status: "completed",
    campaign: "General Fund",
    recurring: true,
  },
];

const stats = [
  {
    title: "Total Donations",
    value: "$12,847",
    description: "+15% from last month",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Monthly Goal",
    value: "68%",
    description: "$8,500 of $12,500",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Active Donors",
    value: "156",
    description: "12 new this month",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Recurring",
    value: "42",
    description: "Monthly supporters",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
];

const ITEMS_PER_PAGE = 6;

export default function DonationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDonations, setSelectedDonations] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Filter and search logic
  const filteredDonations = allDonations.filter((donation) => {
    const matchesSearch =
      donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDonations = filteredDonations.slice(startIndex, endIndex);

  const handleSelectDonation = (donationId: number) => {
    setSelectedDonations((prev) =>
      prev.includes(donationId)
        ? prev.filter((id) => id !== donationId)
        : [...prev, donationId]
    );
  };

  const handleSelectAll = () => {
    const currentDonationIds = currentDonations.map((donation) => donation.id);
    const allCurrentSelected = currentDonationIds.every((id) =>
      selectedDonations.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedDonations((prev) =>
        prev.filter((id) => !currentDonationIds.includes(id))
      );
    } else {
      setSelectedDonations((prev) => [
        ...new Set([...prev, ...currentDonationIds]),
      ]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedDonations.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedDonations.length} donation record(s)?`
      )
    ) {
      console.log("Bulk deleting donations:", selectedDonations);
      setSelectedDonations([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleDownloadReceipt = (donation: any) => {
    console.log("Downloading receipt for donation:", donation);
    alert(`Receipt for donation #${donation.id} will be downloaded`);
  };

  const handleSendThankYou = (donation: any) => {
    console.log("Sending thank you email for donation:", donation);
    alert(`Thank you email sent to ${donation.donor}`);
  };

  const allCurrentSelected =
    currentDonations.length > 0 &&
    currentDonations.every((donation) =>
      selectedDonations.includes(donation.id)
    );
  const someCurrentSelected = currentDonations.some((donation) =>
    selectedDonations.includes(donation.id)
  );

  const handleExport = async (format: "pdf" | "csv" = "pdf") => {
    setIsLoading(true);

    try {
      if (format === "pdf") {
        // Import jsPDF dynamically
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.text("Donations Report", 20, 20);

        // Add generation date
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
        doc.text(`Total Records: ${filteredDonations.length}`, 20, 45);

        // Add summary stats
        const totalAmount = filteredDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );
        const completedDonations = filteredDonations.filter(
          (d) => d.status === "completed"
        );
        const completedAmount = completedDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );

        doc.text(`Total Amount: $${totalAmount.toLocaleString()}`, 20, 55);
        doc.text(
          `Completed Amount: $${completedAmount.toLocaleString()}`,
          20,
          65
        );
        doc.text(
          `Completion Rate: ${(
            (completedDonations.length / filteredDonations.length) *
            100
          ).toFixed(1)}%`,
          20,
          75
        );

        // Add table headers
        let yPosition = 95;
        doc.setFontSize(10);
        doc.text("Donor", 20, yPosition);
        doc.text("Email", 65, yPosition);
        doc.text("Amount", 120, yPosition);
        doc.text("Date", 140, yPosition);
        doc.text("Campaign", 170, yPosition);

        // Add line under headers
        doc.line(20, yPosition + 2, 200, yPosition + 2);
        yPosition += 10;

        // Add donation data
        filteredDonations.forEach((donation, index) => {
          if (yPosition > 270) {
            // Start new page if needed
            doc.addPage();
            yPosition = 20;
          }

          doc.text(donation.donor.substring(0, 30), 20, yPosition);
          doc.text(donation.email.substring(0, 30), 65, yPosition);
          doc.text(`$${donation.amount}`, 120, yPosition);
          doc.text(donation.date, 140, yPosition);
          doc.text(donation.campaign.substring(0, 15), 170, yPosition);
          yPosition += 8;
        });

        // Save the PDF
        doc.save(
          `ZOF Donations Report - ${new Date().toISOString().split("T")[0]}.pdf`
        );
      } else if (format === "csv") {
        // Generate CSV
        const headers = [
          "Donor",
          "Email",
          "Amount",
          "Date",
          "Method",
          "Status",
          "Campaign",
          "Recurring",
        ];
        const csvContent = [
          headers.join(","),
          ...filteredDonations.map((donation) =>
            [
              `"${donation.donor}"`,
              `"${donation.email}"`,
              donation.amount,
              donation.date,
              `"${donation.method}"`,
              donation.status,
              `"${donation.campaign}"`,
              donation.recurring,
            ].join(",")
          ),
        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `ZOF Donations - ${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      alert(`${format.toUpperCase()} export completed successfully!`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Donations"
        breadcrumbs={[{ label: "Donations" }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`${stat.bgColor} border-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`h-8 w-8 rounded-lg ${stat.color
                  .replace("text-", "bg-")
                  .replace("600", "100")} flex items-center justify-center`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          {selectedDonations.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedDonations.length})
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Exporting..." : "Export"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleExport("pdf")}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("csv")}
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => router.push("/donations/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            Track and manage all donations to your foundation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allCurrentSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          someCurrentSelected && !allCurrentSelected;
                    }}
                  />
                </TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDonations.includes(donation.id)}
                      onCheckedChange={() => handleSelectDonation(donation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {donation.donor}
                        {donation.recurring && (
                          <Heart className="h-3 w-3 text-rose-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {donation.email}
                      </div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {donation.campaign}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${donation.amount}</div>
                    <div className="text-sm text-muted-foreground">
                      {donation.method}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {donation.campaign}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {donation.date}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(donation.status)}>
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => handleDownloadReceipt(donation)}
                          className="cursor-pointer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSendThankYou(donation)}
                          className="cursor-pointer"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Thank You Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingStart={startIndex + 1}
            showingEnd={Math.min(endIndex, filteredDonations.length)}
            totalItems={filteredDonations.length}
            itemName="donations"
          />
        </CardContent>
      </Card>
    </div>
  );
}
