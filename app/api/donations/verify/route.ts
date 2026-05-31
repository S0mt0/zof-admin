import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  getDonationByReference,
  updateDonationByReference,
} from "@/lib/db/repository/pages/donations";
import {
  cleanDonationReference,
  getDonationMethod,
} from "@/lib/utils/donations.utils";
import { MailService } from "@/lib/utils/mail.service";
import { verifyPaystackTransaction } from "@/lib/utils/paystack";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

async function verify(reference: string) {
  let cleanReference = cleanDonationReference(reference);

  const existing = await getDonationByReference(cleanReference);

  if (!existing) throw new Error("Donation not found");

  const tx = await verifyPaystackTransaction(cleanReference);

  const completed = tx.status === "success";
  const cancelled = tx.status === "abandoned";

  const donation = await updateDonationByReference(cleanReference, {
    status: completed ? "completed" : cancelled ? "cancelled" : "failed",
    paystackStatus: tx.status,
    method: getDonationMethod(tx),
    paidAt: completed ? new Date(tx.paid_at || Date.now()) : null,
    metadata: tx,
  });

  if (completed && donation.email) {
    const mailer = new MailService();
    if (donation.sendReceipt)
      await mailer.sendDonationReceiptEmail(donation as any);
    if (donation.sendThankYou)
      await mailer.sendDonationThankYouEmail(donation as any);
  }

  return donation;
}

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference");
  if (!reference)
    return Response.json(
      { message: "Reference is required" },
      { headers: corsHeaders, status: 400 }
    );

  try {
    const donation = await verify(reference);

    return Response.json(
      { message: "Donation verified", data: donation },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    let message = "Could not verify donation";

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

export async function POST(request: Request) {
  const reference = (await request.json())?.reference;

  if (!reference)
    return Response.json(
      { message: "Reference is required" },
      { headers: corsHeaders, status: 400 }
    );
  try {
    const donation = await verify(reference);

    return Response.json(
      { message: "Donation verified", data: donation },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    let message = "Could not verify donation";

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
