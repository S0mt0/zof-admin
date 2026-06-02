import { nanoid } from "nanoid";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { createDonation, createDonationSubscription } from "@/lib/db/repository/pages/donations";
import { DonationInitializeSchema } from "@/lib/schemas/pages/donations";
import {
  createPaystackPlan,
  initializePaystackTransaction,
  PAYSTACK_DONATION_CHANNELS,
  PaystackPlanInterval,
} from "@/lib/utils/paystack";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};


const planIntervalByFrequency: Record<string, PaystackPlanInterval | null> = {
  once: null,
  weekly: "weekly",
  monthly: "monthly",
  yearly: "annually",
};

const getRecurringPlanName = (data: {
  amount: number;
  currency: string;
  frequency: string;
}) =>
  `ZOF ${data.currency} ${data.amount.toLocaleString("en-US")} ${data.frequency} donation`;

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  const reference = `zof_${nanoid(10)}`;

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
    const interval = planIntervalByFrequency[data.frequency];
    const recurring = Boolean(interval);

    const callbackUrl = `${FRONTEND_BASE_URL}/donate/callback?reference=${reference}`;

    const plan = recurring
      ? await createPaystackPlan({
          name: getRecurringPlanName(data),
          amount: data.amount,
          currency: data.currency,
          interval: interval!,
        })
      : null;

    const subscription = plan
      ? await createDonationSubscription({
          donor: data.donor,
          email: data.email,
          phone: data.phone || null,
          amount: data.amount,
          currency: data.currency,
          frequency: data.frequency,
          anonymous: data.anonymous,
          sendReceipt: data.sendReceipt,
          sendThankYou: data.sendThankYou,
          status: "pending",
          paystackPlanCode: plan.plan_code,
          campaignId: data.campaignId || null,
          metadata: {
            source: "website",
            plan,
          },
        })
      : null;

    const donation = await createDonation({
      donor: data.donor,
      email: data.email,
      phone: data.phone || null,
      amount: data.amount,
      currency: data.currency,
      notes: data.notes || null,
      recurring,
      frequency: data.frequency,
      anonymous: data.anonymous,
      sendReceipt: data.sendReceipt,
      sendThankYou: data.sendThankYou,
      status: "pending",
      reference,
      campaignId: data.campaignId || null,
      subscriptionId: subscription?.id || null,
      paystackPlanCode: plan?.plan_code || null,
      metadata: {
        source: "website",
        campaignId: data.campaignId || null,
        currency: data.currency,
        frequency: data.frequency,
        recurring,
        plan,
      },
    });

    const paystack = await initializePaystackTransaction({
      email: data.email,
      amount: data.amount,
      currency: data.currency,
      channels: PAYSTACK_DONATION_CHANNELS,
      reference,
      callback_url: callbackUrl,
      plan: plan?.plan_code,
      metadata: {
        donationId: donation.id,
        subscriptionId: subscription?.id || null,
        donor: data.anonymous ? "Anonymous donor" : data.donor,
        campaignId: data.campaignId || null,
        currency: data.currency,
        frequency: data.frequency,
        recurring,
        planCode: plan?.plan_code || null,
      },
    });

    const updated = await (
      await import("@/lib/db/repository/pages/donations")
    ).updateDonationByReference(reference, {
      accessCode: paystack.access_code,
      authorizationUrl: paystack.authorization_url,
      paystackPlanCode: plan?.plan_code || null,
    });

    return Response.json(
      {
        message: "Donation initialized",
        data: { donation: updated, paystack },
      },
      { headers: corsHeaders, status: 201 }
    );
  } catch (error) {
    let message = "Could not initialize donation";

    if (error instanceof Error) {
      if (error.message.length) {
        message = error.message;
      }
    } else if (typeof error === "string" && error.length) {
      message = error;
    }

    await (
      await import("@/lib/db/repository/pages/donations")
    ).updateDonationByReference(reference, {
      status: "failed",
      failReason: message,
    });

    return Response.json({ message }, { headers: corsHeaders, status: 500 });
  }
}
