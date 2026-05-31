export type DonationSummary = {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  cancelled: number;
  totalAmount: number;
  completedAmount: number;
};

export type DeleteTarget = { type: "single"; id: string } | { type: "bulk" } | null;

export type DonationTableSearchParams = Record<string, string | undefined>;
