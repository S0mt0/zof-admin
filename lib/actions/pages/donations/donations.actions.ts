"use server";

import { revalidatePath } from "next/cache";

import { deleteDonation, getDonationById, listAllDonations } from "@/lib/db/repository/pages/donations";
import { createDonationsPdfBuffer, donationsToCsv } from "@/lib/utils/donations-export";
import { MailService } from "@/lib/utils/mail.service";

import { getAuthorizedDonationAdmin, logDonationActivity, sectionPath } from "./shared";

export const deleteDonationAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteDonation(id);
    await logDonationActivity("Donation deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("manage"));
    return { success: "Donation deleted" };
  } catch {
    return { error: "Could not delete donation" };
  }
};

export const sendDonationReceiptAction = async (id: string) => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };

  const donation = await getDonationById(id);
  if (!donation?.email) return { error: "Donation has no donor email" };

  try {
    await new MailService().sendDonationReceiptEmail(donation as any);
    await logDonationActivity("Donation receipt sent", auth.user.name, auth.user.role);
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
    await logDonationActivity("Donation thank-you sent", auth.user.name, auth.user.role);
    return { success: "Thank-you message sent" };
  } catch {
    return { error: "Could not send thank-you message" };
  }
};


export const sendDonationsExportAction = async (format: "pdf" | "csv") => {
  const auth = await getAuthorizedDonationAdmin();
  if ("error" in auth) return { error: auth.error };
  if (!auth.user.email) return { error: "Your admin account has no email address." };

  try {
    const donations = (await listAllDonations()) as Donation[];
    if (!donations.length) return { error: "There are no donations to export yet." };

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

    await logDonationActivity(`Donation ${format.toUpperCase()} export emailed`, auth.user.name, auth.user.role);
    return { success: `${format.toUpperCase()} export sent to your email.` };
  } catch (error) {
    console.error("Donation export email error:", error);
    return { error: "Could not send donation export." };
  }
};
