const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const PAYSTACK_DONATION_CHANNELS = [
  "card",
  "bank",
  "apple_pay",
  "ussd",
  "qr",
  "mobile_money",
  "bank_transfer",
] as const;

export type PaystackDonationChannel =
  (typeof PAYSTACK_DONATION_CHANNELS)[number];
export type PaystackPlanInterval = "weekly" | "monthly" | "annually";

export const PAYSTACK_TRANSACTION_STATUSES = [
  "abandoned",
  "failed",
  "ongoing",
  "pending",
  "reversed",
  "success",
] as const;

export type PaystackTransactionStatus =
  (typeof PAYSTACK_TRANSACTION_STATUSES)[number];

export const isPaystackTransactionStatus = (
  status: string
): status is PaystackTransactionStatus =>
  PAYSTACK_TRANSACTION_STATUSES.includes(status as PaystackTransactionStatus);

export const normalizePaystackDonationStatus = (status?: string | null) => {
  if (!status) return "failed" satisfies PaystackTransactionStatus;

  const normalized = status.toLowerCase();
  if (normalized === "processing") return "pending";
  if (normalized === "queued") return "pending";
  if (isPaystackTransactionStatus(normalized)) return normalized;

  return "failed" satisfies PaystackTransactionStatus;
};

const getSecretKey = () => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
};

export async function initializePaystackTransaction(data: {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  currency?: "NGN" | "USD";
  channels?: readonly PaystackDonationChannel[];
  metadata?: Record<string, unknown>;
  plan?: string;
}) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      amount: Math.round(data.amount * 100),
      currency: data.currency || "NGN",
      channels: data.plan
        ? undefined
        : data.channels || PAYSTACK_DONATION_CHANNELS,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status)
    throw new Error(json.message || "Paystack initialization failed");
  return json.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyPaystackTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
    }
  );

  const json = await res.json();
  console.log("Paystack verification response:", json);
  if (!res.ok || !json.status)
    throw new Error(json.message || "Paystack verification failed");
  return json.data as any;
}

export async function createPaystackPlan(data: {
  name: string;
  amount: number;
  interval: PaystackPlanInterval;
  currency?: "NGN" | "USD";
}) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      amount: Math.round(data.amount * 100),
      interval: data.interval,
      currency: data.currency || "NGN",
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status)
    throw new Error(json.message || "Paystack plan creation failed");

  return json.data as {
    plan_code: string;
    name: string;
    amount: number;
    interval: PaystackPlanInterval;
    currency: string;
  };
}
