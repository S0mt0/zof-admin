import fs from "fs";
import path from "path";
import { format } from "date-fns";

const LOGO_URL = "https://zitaonyekafoundation.s3.eu-west-2.amazonaws.com/media/zof-logo.png";
const LOCAL_LOGO_PATH = path.join(process.cwd(), "public", "zof-logo.png");

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

const getLogoDataUrl = () => {
  try {
    if (!fs.existsSync(LOCAL_LOGO_PATH)) return null;
    const base64 = fs.readFileSync(LOCAL_LOGO_PATH).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
};

export const formatDonationDateTime = (value?: Date | string | null) => {
  const date = new Date(value || Date.now());
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
};

export const getDonationMethod = (payload: any) =>
  payload?.channel ||
  payload?.authorization?.channel ||
  payload?.authorization?.card_type ||
  payload?.payment_type ||
  payload?.metadata?.channel ||
  "paystack";

export const donationExportHeadings = [
  "S/N",
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
  donations.map((donation, index) => [
    index + 1,
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

const getDonationPdfRows = (donations: Donation[]) =>
  donations.map((donation, index) => [
    index + 1,
    formatDonationDateTime(donation.paidAt || donation.createdAt),
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
  const logo = getLogoDataUrl();

  doc.setFillColor(23, 63, 53);
  doc.rect(0, 0, 297, 34, "F");
  if (logo) doc.addImage(logo, "PNG", 14, 7, 20, 20);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text("Donation Records", logo ? 40 : 14, 16);
  doc.setFontSize(9);
  doc.text("Zita-Onyeka Foundation", logo ? 40 : 14, 23);
  doc.setTextColor(247, 200, 123);
  doc.text(`Generated: ${formatDonationDateTime(new Date())}`, 210, 17);
  doc.text(`${donations.length} donation${donations.length === 1 ? "" : "s"}`, 210, 24);

  autoTable(doc, {
    startY: 42,
    head: [[...donationExportHeadings]],
    body: getDonationPdfRows(donations),
    styles: { fontSize: 7.5, cellPadding: 2, overflow: "linebreak" },
    headStyles: { fillColor: [25, 95, 74], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [247, 250, 248] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 26 },
      4: { cellWidth: 26 },
      5: { cellWidth: 27 },
      9: { cellWidth: 26 },
    },
    margin: { left: 10, right: 10 },
  });

  return Buffer.from(doc.output("arraybuffer"));
};

export const createDonationReceiptPdfBuffer = async (donation: Donation) => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const logo = getLogoDataUrl();
  const amount = money(donation.amount, donation.currency);
  const date = formatDonationDateTime(donation.paidAt || donation.createdAt);
  const donor = donation.anonymous ? "Anonymous donor" : donation.donor || "Donor";

  doc.setFillColor(246, 251, 247);
  doc.rect(0, 0, 210, 297, "F");
  doc.setFillColor(23, 63, 53);
  doc.rect(0, 0, 210, 46, "F");
  if (logo) doc.addImage(logo, "PNG", 18, 12, 22, 22);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Donation Receipt", logo ? 48 : 18, 22);
  doc.setFontSize(10);
  doc.text("Zita-Onyeka Foundation", logo ? 48 : 18, 30);

  doc.setTextColor(15, 23, 42);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(18, 62, 174, 148, 4, 4, "F");
  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text("Receipt issued to", 30, 82);
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(donor, 30, 95, { maxWidth: 150 });

  const rows = [
    ["Amount", amount],
    ["Status", donation.status],
    ["Frequency", donation.frequency],
    ["Method", donation.method],
    ["Reference", donation.reference],
    ["Date", date],
  ];

  let y = 118;
  rows.forEach(([label, value]) => {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(label, 30, y);
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(String(value || "-"), 82, y);
    y += 13;
  });

  doc.setFillColor(238, 248, 240);
  doc.roundedRect(18, 224, 174, 28, 3, 3, "F");
  doc.setTextColor(31, 93, 64);
  doc.setFontSize(10);
  doc.text("Thank you. Your gift helps keep practical care moving through communities.", 30, 240, { maxWidth: 150 });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Logo: ${LOGO_URL}`, 18, 280, { maxWidth: 174 });

  return Buffer.from(doc.output("arraybuffer"));
};

export function cleanDonationReference(reference: string = "") {
  let cleanReference = reference;

  if (Array.isArray(cleanReference)) {
    cleanReference = cleanReference[0];
  } else {
    try {
      cleanReference = JSON.parse(reference);
    } catch (error) {
      console.error("Error parsing verification reference:", error);
    }
  }

  if (reference.includes("=")) {
    cleanReference = reference.split("=")[0];
  }
  if (reference.includes(",")) {
    cleanReference = reference.split(",")[0];
  }

  return cleanReference;
}
