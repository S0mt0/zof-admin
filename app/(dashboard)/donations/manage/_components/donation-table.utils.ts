import { BadgeProps } from "@/components/ui/badge";

export const money = (amount: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDateTime = (value?: Date | string | null) =>
  new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value || Date.now()));

export const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

export const formatMetadata = (value: unknown) => {
  if (!value) return "-";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const getStatusVariant = (
  status: DonationStatus
): BadgeProps["variant"] => {
  if (status === "completed") return "default";
  if (status === "failed") return "destructive";
  if (status === "cancelled" || status === "refunded") return "outline";
  return "secondary";
};
