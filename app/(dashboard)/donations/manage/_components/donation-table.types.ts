export type DonationSummary = {
  total: number;
  success: number;
  pending: number;
  ongoing: number;
  failed: number;
  abandoned: number;
  reversed: number;
  totalAmount: number;
  successAmount: number;
};

export type DeleteTarget = { type: "single"; id: string } | { type: "bulk" } | null;

export type DonationTableSearchParams = Record<string, string | undefined>;
