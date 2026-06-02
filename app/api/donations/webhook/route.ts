import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import {
  createDonation,
  getDonationByReference,
  getDonationSubscriptionByPlanCode,
  getDonationSubscriptionBySubscriptionCode,
  updateDonationByReference,
  updateDonationSubscription,
  updateDonationSubscriptionBySubscriptionCode,
} from "@/lib/db/repository/pages/donations";
import { MailService } from "@/lib/utils/mail.service";
import {
  cleanDonationReference,
  getDonationMethod,
} from "@/lib/utils/donations.utils";
import { getPaystackDonationOutcome, normalizePaystackDonationStatus } from "@/lib/utils/paystack";

const PAYSTACK_WEBHOOK_IPS = new Set([
  "52.31.139.75",
  "52.49.173.169",
  "52.214.14.220",
]);

const normalizeIp = (value: string | null) =>
  value?.trim().replace(/^::ffff:/, "") || "";

const getRequestIp = (headers: Headers) => {
  const forwardedFor = headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0];

  return normalizeIp(
    firstForwardedIp ||
      headers.get("x-real-ip") ||
      headers.get("cf-connecting-ip") ||
      headers.get("true-client-ip")
  );
};

const isPaystackIp = (headers: Headers) =>
  PAYSTACK_WEBHOOK_IPS.has(getRequestIp(headers));

export async function GET() {
  return Response.json({
    health: "ok",
  });
}

export async function POST(request: Request) {
  try {
    const requestIp = getRequestIp(request.headers);

    if (!isPaystackIp(request.headers)) {
      console.warn("Paystack donation webhook rejected: IP not allowed", {
        requestIp,
      });
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";
    const secret = process.env.PAYSTACK_SECRET_KEY || "";

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (!secret || hash !== signature) {
      console.warn("Paystack donation webhook rejected: invalid signature");
      return Response.json({ message: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.info("Paystack donation webhook event", {
      event: event.event,
      reference: event.data?.reference,
    });

    if (event.event === "charge.success") {
      const reference = cleanDonationReference(event.data?.reference);
      const existing = reference
        ? await getDonationByReference(reference)
        : null;
      const subscriptionCode = event.data?.subscription?.subscription_code;
      const planCode = event.data?.plan?.plan_code;
      const subscription = subscriptionCode
        ? await getDonationSubscriptionBySubscriptionCode(subscriptionCode)
        : planCode
        ? await getDonationSubscriptionByPlanCode(planCode)
        : null;

      const donation = existing
        ? await updateDonationByReference(reference, {
            status: "success",
            paystackStatus: event.data?.status || "success",
            method: getDonationMethod(event.data),
            paidAt: new Date(event.data?.paid_at || Date.now()),
            metadata: event.data,
            paystackPlanCode: planCode || existing.paystackPlanCode || null,
            paystackSubscriptionCode:
              subscriptionCode || existing.paystackSubscriptionCode || null,
            paystackCustomerCode:
              event.data?.customer?.customer_code ||
              existing.paystackCustomerCode ||
              null,
          })
        : subscription && reference
        ? await createDonation({
            donor: subscription.donor,
            email: subscription.email,
            phone: subscription.phone,
            amount: event.data?.amount
              ? event.data.amount / 100
              : subscription.amount,
            currency: event.data?.currency || subscription.currency,
            method: getDonationMethod(event.data),
            recurring: true,
            frequency: subscription.frequency,
            anonymous: subscription.anonymous,
            sendReceipt: subscription.sendReceipt,
            sendThankYou: subscription.sendThankYou,
            status: "success",
            reference,
            paystackStatus: event.data?.status || "success",
            paidAt: new Date(event.data?.paid_at || Date.now()),
            metadata: event.data,
            paystackPlanCode: planCode || subscription.paystackPlanCode,
            paystackSubscriptionCode:
              subscriptionCode || subscription.paystackSubscriptionCode,
            paystackCustomerCode:
              event.data?.customer?.customer_code ||
              subscription.paystackCustomerCode,
            subscriptionId: subscription.id,
            campaignId: subscription.campaignId || null,
          })
        : null;

      if (!donation) {
        console.warn("Paystack donation webhook skipped: donation not found", {
          reference,
          subscriptionCode,
          planCode,
        });
      }

      if (donation?.email) {
        const mailer = new MailService();

        Promise.allSettled([
          donation.sendReceipt
            ? mailer.sendDonationReceiptEmail(donation as any)
            : Promise.resolve(),

          donation.sendThankYou
            ? mailer.sendDonationThankYouEmail(donation as any)
            : Promise.resolve(),
        ]);
      }

      if (donation?.subscriptionId) {
        await updateDonationSubscription(donation.subscriptionId, {
          status: "active",
          paystackPlanCode: donation.paystackPlanCode,
          paystackSubscriptionCode: donation.paystackSubscriptionCode,
          paystackCustomerCode: donation.paystackCustomerCode,
          metadata: event.data,
        });
      }
    }

    if (event.event === "subscription.create") {
      const subscriptionCode = event.data?.subscription_code;
      const planCode = event.data?.plan?.plan_code;
      const existingSubscription = planCode
        ? await getDonationSubscriptionByPlanCode(planCode)
        : null;

      if (existingSubscription) {
        await updateDonationSubscription(existingSubscription.id, {
          status: "active",
          paystackSubscriptionCode: subscriptionCode || null,
          paystackCustomerCode: event.data?.customer?.customer_code || null,
          paystackEmailToken: event.data?.email_token || null,
          metadata: event.data,
        });
      }
    }

    if (event.event === "invoice.payment_failed") {
      const subscriptionCode = event.data?.subscription?.subscription_code;
      if (subscriptionCode) {
        await updateDonationSubscriptionBySubscriptionCode(subscriptionCode, {
          status: "failed",
          metadata: event.data,
        });
      }
    }

    if (event.event === "subscription.disable") {
      const subscriptionCode = event.data?.subscription_code;
      if (subscriptionCode) {
        await updateDonationSubscriptionBySubscriptionCode(subscriptionCode, {
          status: "disabled",
          metadata: event.data,
        });
      }
    }

    if (event.event !== "charge.success") {
      const reference = cleanDonationReference(event.data?.reference);
      const status = normalizePaystackDonationStatus(event.data?.status);

      if (reference && status !== "success") {
        const existing = await getDonationByReference(reference).catch(
          () => null
        );
        if (existing) {
          await updateDonationByReference(reference, {
            status,
            paystackStatus: event.data?.status || status,
            failReason: getPaystackDonationOutcome(event.data),
            metadata: event.data,
          });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Paystack donation webhook failed", error);
    return Response.json(
      { message: "Could not process donation webhook" },
      { status: 500 }
    );
  }
}
