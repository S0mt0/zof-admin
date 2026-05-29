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

export type PaystackDonationChannel = (typeof PAYSTACK_DONATION_CHANNELS)[number];

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
      channels: data.channels || PAYSTACK_DONATION_CHANNELS,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.message || "Paystack initialization failed");
  return json.data as { authorization_url: string; access_code: string; reference: string };
}

export async function verifyPaystackTransaction(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${getSecretKey()}` },
  });

  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(json.message || "Paystack verification failed");
  return json.data as any;
}
