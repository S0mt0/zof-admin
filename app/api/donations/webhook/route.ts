import crypto from "crypto";

import {
  getDonationByReference,
  updateDonationByReference,
} from "@/lib/db/repository/pages/donations";
import { MailService } from "@/lib/utils/mail.service";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (!secret || hash !== signature) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  if (event.event === "charge.success") {
    const reference = event.data?.reference;
    const existing = reference ? await getDonationByReference(reference) : null;

    console.log(
      "Paystack webhook received for reference:",
      reference,
      "existing donation:",
      !!existing
    );

    if (existing) {
      const donation = await updateDonationByReference(reference, {
        status: "completed",
        paystackStatus: event.data?.status || "success",
        method: event.data?.channel || "paystack",
        paidAt: new Date(event.data?.paid_at || Date.now()),
        metadata: event.data,
      });

      if (donation.email) {
        const mailer = new MailService();
        if (donation.sendReceipt)
          await mailer.sendDonationReceiptEmail(donation as any);
        if (donation.sendThankYou)
          await mailer.sendDonationThankYouEmail(donation as any);
      }
    }
  }

  return Response.json({ received: true });
}
