import {
  listUnresolvedDonations,
  updateDonationByReference,
  updateDonationSubscription,
} from "@/lib/db/repository/pages/donations";
import { getDonationMethod } from "@/lib/utils/donations.utils";
import {
  getPaystackDonationOutcome,
  normalizePaystackDonationStatus,
  verifyPaystackTransaction,
} from "@/lib/utils/paystack";

export type DonationSyncResult = {
  checkedCount: number;
  updatedCount: number;
  skippedCount: number;
};

export const syncUnresolvedDonations = async (): Promise<DonationSyncResult> => {
  const donations = await listUnresolvedDonations();
  let updatedCount = 0;
  let skippedCount = 0;

  await Promise.allSettled(
    donations.map(async (donation) => {
      try {
        const tx = await verifyPaystackTransaction(donation.reference);
        const status = normalizePaystackDonationStatus(tx.status);
        const completed = status === "success";

        const updated = await updateDonationByReference(donation.reference, {
          status,
          paystackStatus: tx.status,
          method: getDonationMethod(tx),
          paidAt: completed ? new Date(tx.paid_at || Date.now()) : null,
          failReason: getPaystackDonationOutcome(tx),
          metadata: tx,
          paystackPlanCode: tx.plan?.plan_code || donation.paystackPlanCode || null,
          paystackSubscriptionCode:
            tx.subscription?.subscription_code ||
            donation.paystackSubscriptionCode ||
            null,
          paystackCustomerCode:
            tx.customer?.customer_code || donation.paystackCustomerCode || null,
        });

        if (completed && updated.subscriptionId) {
          await updateDonationSubscription(updated.subscriptionId, {
            status: "active",
            paystackPlanCode: updated.paystackPlanCode,
            paystackSubscriptionCode: updated.paystackSubscriptionCode,
            paystackCustomerCode: updated.paystackCustomerCode,
            metadata: tx,
          });
        }

        updatedCount += 1;
      } catch (error) {
        console.warn("Donation sync skipped", {
          reference: donation.reference,
          error,
        });
        skippedCount += 1;
      }
    })
  );

  return {
    checkedCount: donations.length,
    updatedCount,
    skippedCount,
  };
};
