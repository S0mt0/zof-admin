import { nanoid } from "nanoid";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { createDonation } from "@/lib/db/repository/pages/donations";
import { DonationInitializeSchema } from "@/lib/schemas/pages/donations";
import {
  initializePaystackTransaction,
  PAYSTACK_DONATION_CHANNELS,
} from "@/lib/utils/paystack";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = DonationInitializeSchema.safeParse(body);
    if (!validated.success) {
      return Response.json(
        { message: "Invalid donation details" },
        { headers: corsHeaders, status: 400 }
      );
    }

    const data = validated.data;
    const reference = `zof_${nanoid(7)}`;
    const callbackUrl = `${FRONTEND_BASE_URL}/donate/callback?reference=${reference}`;

    const donation = await createDonation({
      donor: data.donor,
      email: data.email,
      phone: data.phone || null,
      amount: data.amount,
      currency: data.currency,
      notes: data.notes || null,
      recurring: data.frequency === "monthly",
      frequency: data.frequency,
      anonymous: data.anonymous,
      sendReceipt: data.sendReceipt,
      sendThankYou: data.sendThankYou,
      status: "pending",
      reference,
      campaignId: data.campaignId || null,
      metadata: {
        source: "website",
        campaignId: data.campaignId || null,
        currency: data.currency,
      },
    });

    const paystack = await initializePaystackTransaction({
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      channels: PAYSTACK_DONATION_CHANNELS,
      reference,
      callback_url: callbackUrl,
      metadata: {
        donationId: donation.id,
        donor: data.anonymous ? "Anonymous donor" : data.donor,
        campaignId: data.campaignId || null,
        currency: data.currency,
        channels: PAYSTACK_DONATION_CHANNELS,
      },
    });

    const updated = await (
      await import("@/lib/db/repository/pages/donations")
    ).updateDonationByReference(reference, {
      accessCode: paystack.access_code,
      authorizationUrl: paystack.authorization_url,
    });

    return Response.json(
      {
        message: "Donation initialized",
        data: { donation: updated, paystack },
      },
      { headers: corsHeaders, status: 201 }
    );
  } catch (error) {
    console.error("Donation initialize error:", error);
    return Response.json(
      { message: "Could not initialize donation" },
      { headers: corsHeaders, status: 500 }
    );
  }
}
