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


export const normalizeDonationStatus = (status: string): DonationStatus => {
  if (status === "completed") return "success";
  if (status === "cancelled") return "abandoned";
  if (status === "refunded") return "reversed";
  if (
    status === "success" ||
    status === "pending" ||
    status === "ongoing" ||
    status === "abandoned" ||
    status === "failed" ||
    status === "reversed"
  ) {
    return status;
  }
  return "failed";
};

export const getStatusVariant = (
  status: DonationStatus
): BadgeProps["variant"] => {
  if (status === "success") return "default";
  if (status === "failed") return "destructive";
  if (status === "abandoned" || status === "reversed") return "outline";
  if (status === "ongoing") return "secondary";
  return "secondary";
};

export const getStatusClassName = (status: DonationStatus) => {
  if (status === "success") return "bg-emerald-600 text-white hover:bg-emerald-600/90";
  if (status === "pending") return "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50";
  if (status === "ongoing") return "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50";
  if (status === "abandoned") return "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-50";
  if (status === "reversed") return "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-50";
  return "bg-red-600 text-white hover:bg-red-600/90";
};
