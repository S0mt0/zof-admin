"use server";

import { revalidatePath } from "next/cache";

import {
  deleteDonation,
  deleteDonations,
  getDonationById,
  listAllDonations,
  listUnresolvedDonations,
  updateDonationByReference,
  updateDonationSubscription,
} from "@/lib/db/repository/pages/donations";
import {
  createDonationsPdfBuffer,
  donationsToCsv,
} from "@/lib/utils/donations.utils";
import { MailService } from "@/lib/utils/mail.service";
import { normalizePaystackDonationStatus, verifyPaystackTransaction } from "@/lib/utils/paystack";
import { getDonationMethod } from "@/lib/utils/donations.utils";

import {
  getAuthorizedDonationAdmin,
  logDonationActivity,
  sectionPath,
} from "./shared";

export const deleteDonationAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteDonation(id);
    await logDonationActivity(
      "Donation deleted",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("manage"));
    return { success: "Donation deleted" };
  } catch {
    return { error: "Could not delete donation" };
  }
};

export const deleteDonationsAction = async (ids: string[]) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  const validIds = ids.filter(Boolean);
  if (!validIds.length) return { error: "Select at least one donation." };

  try {
    await deleteDonations(validIds);
    await logDonationActivity("Donations deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("manage"));
    return { success: `${validIds.length} donation${validIds.length === 1 ? "" : "s"} deleted` };
  } catch {
    return { error: "Could not delete donations" };
  }
};

export const sendDonationReceiptAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  const donation = await getDonationById(id);
  if (!donation?.email) return { error: "Donation has no donor email" };

  try {
    await new MailService().sendDonationReceiptEmail(donation as any);
    await logDonationActivity(
      "Donation receipt sent",
      auth.user.name,
      auth.user.role
    );
    return { success: "Receipt sent" };
  } catch {
    return { error: "Could not send receipt" };
  }
};

export const sendDonationThankYouAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  const donation = await getDonationById(id);
  if (!donation?.email) return { error: "Donation has no donor email" };

  try {
    await new MailService().sendDonationThankYouEmail(donation as any);
    await logDonationActivity(
      "Donation thank-you sent",
      auth.user.name,
      auth.user.role
    );
    return { success: "Thank-you message sent" };
  } catch {
    return { error: "Could not send thank-you message" };
  }
};

export const sendDonationsExportAction = async (format: "pdf" | "csv") => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  if (!auth.user.email)
    return { error: "Your admin account has no email address." };

  try {
    const donations = (await listAllDonations()) as Donation[];
    if (!donations.length)
      return { error: "There are no donations to export yet." };

    const now = new Date().toISOString().slice(0, 10);
    const isPdf = format === "pdf";
    const content = isPdf
      ? await createDonationsPdfBuffer(donations)
      : Buffer.from(donationsToCsv(donations), "utf8");

    await new MailService().sendMail({
      to: auth.user.email,
      subject: `Donation export (${format.toUpperCase()})`,
      text: `Attached is the ${format.toUpperCase()} donation export requested from the admin dashboard.`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#10231d;line-height:1.7;">
          <h2 style="margin:0 0 10px;">Donation export is ready</h2>
          <p style="margin:0 0 16px;">Attached is the ${format.toUpperCase()} donation export requested from the admin dashboard.</p>
          <p style="margin:0;color:#64748b;font-size:14px;">Generated on ${now}.</p>
        </div>
      `,
      attachments: [
        {
          filename: `zof-donations-${now}.${format}`,
          content,
        },
      ],
    } as any);

    await logDonationActivity(
      `Donation ${format.toUpperCase()} export emailed`,
      auth.user.name,
      auth.user.role
    );
    return { success: `${format.toUpperCase()} export sent to your email.` };
  } catch (error) {
    console.error("Donation export email error:", error);
    return { error: "Could not send donation export." };
  }
};

export const syncUnresolvedDonationsAction = async () => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  try {
    const donations = await listUnresolvedDonations();
    if (!donations.length) return { success: "No pending donations to sync." };

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
            failReason: completed ? null : tx.gateway_response || tx.message || null,
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

    await logDonationActivity(
      "Donation status sync completed",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("manage"));
    revalidatePath(sectionPath("subscriptions"));

    return {
      success: `Synced ${updatedCount} donation${updatedCount === 1 ? "" : "s"}.${
        skippedCount ? ` ${skippedCount} skipped.` : ""
      }`,
    };
  } catch (error) {
    console.error("Donation sync error", error);
    return { error: "Could not sync pending donations." };
  }
};
