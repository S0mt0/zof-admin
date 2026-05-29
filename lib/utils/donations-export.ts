import { format } from "date-fns";

const money = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const csvEscape = (value: unknown) => {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const donationExportHeadings = [
  "Date",
  "Donor",
  "Email",
  "Phone",
  "Amount",
  "Status",
  "Frequency",
  "Campaign",
  "Reference",
  "Method",
] as const;

export const getDonationExportRows = (donations: Donation[]) =>
  donations.map((donation) => [
    format(new Date(donation.createdAt), "yyyy-MM-dd HH:mm"),
    donation.anonymous ? "Anonymous" : donation.donor || "-",
    donation.email || "-",
    donation.phone || "-",
    money(donation.amount, donation.currency),
    donation.status,
    donation.frequency,
    donation.campaign?.topic || "Where needed most",
    donation.reference,
    donation.method,
  ]);

export const donationsToCsv = (donations: Donation[]) => {
  const rows = [donationExportHeadings, ...getDonationExportRows(donations)];
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
};

export const createDonationsPdfBuffer = async (donations: Donation[]) => {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(16);
  doc.text("Zita-Onyeka Foundation Donations", 14, 16);
  autoTable(doc, {
    startY: 24,
    head: [[...donationExportHeadings]],
    body: getDonationExportRows(donations),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [25, 95, 74] },
  });

  return Buffer.from(doc.output("arraybuffer"));
};
