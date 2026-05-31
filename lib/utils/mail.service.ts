import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { format } from "date-fns";
import { type CreateEmailOptions, Resend } from "resend";

import { APP_URL } from "../constants";
import {
  createDonationReceiptPdfBuffer,
  formatDonationDateTime,
} from "./donations.utils";
import { capitalize } from "./helpers.utils";

export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private google_sender: string;
  private resender: string;
  private resend: Resend;

  constructor(private appName: string = "Zita-Onyeka Foundation") {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    this.google_sender = `${this.appName} <${process.env.GOOGLE_APP_USER}>`;

    this.resender = `${this.appName} <no-reply@zitaonyekafoundation.org>`;
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendMail(options: Omit<CreateEmailOptions, "from">) {
    return await this.resend.emails.send({
      ...options,
      from: this.resender,
    } as CreateEmailOptions);
  }

  async sendGoogleMail(options: {
    subject: string;
    to: string | string[];
    html?: string;
    text?: string;
  }) {
    return await this.transporter.sendMail({
      ...options,
      from: this.google_sender,
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    try {
      const confirmationLink = `${APP_URL}/auth/verify-account?token=${token}`;

      const { data, error } = await this.sendMail({
        subject: "Confirm your email",
        to,
        text: `Click the link to verify your account ${confirmationLink}`,
        html: `<p>Click <a href="${confirmationLink}">here</a> to confirm email.</p>`,
      });

      console.log({ data, error });
    } catch (error) {
      console.error("[error_sending_account_verification_email]: ", error);
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const resetLink = `${APP_URL}/auth/reset-password?token=${token}`;

      await this.sendMail({
        subject: "Reset your password",
        to: email,
        text: `Click the link to reset your password ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link is valid for only 15 minutes.</p>`,
      });
    } catch (error) {
      console.error("[error_sending_password_reset_email]: ", error);
    }
  }

  async sendBlogDeleteEmail(
    deletedBy: { name: string; role: string },
    deletedBlog: Blog
  ) {
    const now = new Date();

    const text = `Hello ${deletedBlog?.author?.name || "there"},

    Your blog post titled "${deletedBlog.title}" was deleted by ${
      deletedBy.role === "admin" ? "an administrator" : "an editor"
    }, ${capitalize(deletedBy.name!)} on ${format(
      now,
      "EEEE, MMMM d, yyyy 'at' h:mmaaa"
    )}.
    
    Delete Summary:
    - Blog Title: ${deletedBlog.title}
    - Author: ${deletedBlog?.author?.name || "Unknown"}
    - Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})
    - Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
    
    Best regards,
    The Editorial Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello ${deletedBlog.author?.name || "there"},</p>
      <p>
        Your blog post titled 
        <strong>"${deletedBlog.title}"</strong> was deleted by 
        ${deletedBy.role === "admin" ? "an administrator" : "an editor"}, 
        <strong>${capitalize(deletedBy.name!)}</strong> on 
        ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}.
      </p>
      
      <div style="margin: 24px 0;">
        <strong>Delete Summary:</strong><br/>
        Blog Title: ${deletedBlog.title}<br/>
        Author: ${deletedBlog.author?.name || "Unknown"}<br/>
        Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})<br/>
        Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
      </div>
  
      <p>
        If you did not request or expect this delete action, you may want to <a href="mailto:onyekazita@gmail.com">contact admin</a> or <a href="mailto:sewkito@gmail.com">support team</a>.
      </p>
  
      <p>Best regards,<br/>The Editorial Team</p>
    </div>
  `;

    try {
      await this.sendMail({
        subject: "Notice on your deleted blog post",
        to: deletedBlog.author?.email!,
        text,
        html,
      });
    } catch (error) {
      console.error("[error_sending_blog_update_email]: ", error);
    }
  }

  async sendEventDeleteEmail(
    deletedBy: { name: string; role: string },
    deletedEvent: IEvent
  ) {
    const now = new Date();

    const text = `Hello ${deletedEvent?.createdByUser?.name || "there"},

    Your event titled "${deletedEvent.name}" was deleted by ${
      deletedBy.role === "admin" ? "an administrator" : "an editor"
    }, ${capitalize(deletedBy.name!)} on ${format(
      now,
      "EEEE, MMMM d, yyyy 'at' h:mmaaa"
    )}.
    
    Delete Summary:
    - Event Name: ${deletedEvent.name}
    - Author: ${deletedEvent?.createdByUser?.name || "Unknown"}
    - Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})
    - Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
    
    Best regards,
    The Editorial Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello ${deletedEvent?.createdByUser?.name || "there"},</p>
      <p>
        Your event titled 
        <strong>"${deletedEvent.name}"</strong> was deleted by 
        ${deletedBy.role === "admin" ? "an administrator" : "an editor"}, 
        <strong>${capitalize(deletedBy.name!)}</strong> on 
        ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}.
      </p>
      
      <div style="margin: 24px 0;">
        <strong>Delete Summary:</strong><br/>
        Event Name: ${deletedEvent.name}<br/>
        Author: ${deletedEvent?.createdByUser?.name || "Unknown"}<br/>
        Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})<br/>
        Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
      </div>
  
      <p>
        If you did not request or expect this delete action, you may want to <a href="mailto:onyekazita@gmail.com">contact admin</a> or <a href="mailto:sewkito@gmail.com">support team</a>.
      </p>
  
      <p>Best regards,<br/>The Editorial Team</p>
    </div>
  `;

    try {
      await this.sendMail({
        subject: "Notice on your deleted event",
        to: deletedEvent?.createdByUser?.email!,
        text,
        html,
      });
    } catch (error) {
      console.error("[error_sending_event_update_email]: ", error);
    }
  }

  private donationEmailShell({
    title,
    eyebrow,
    content,
  }: {
    title: string;
    eyebrow: string;
    content: string;
  }) {
    const logoUrl =
      "https://zitaonyekafoundation.s3.eu-west-2.amazonaws.com/media/zof-logo.png";

    return `
      <div style="margin:0;padding:0;background:#144D49;font-family:Arial,sans-serif;color:#10231d;">
        <div style="max-width:660px;margin:0 auto;padding:34px 18px;">
          <div style="background:#ffffff;border:1px solid #dfe8e2;overflow:hidden;">
            <div style="background:#173f35;padding:24px 26px;color:#ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                <tr>
                  <td style="width:62px;vertical-align:top;">
                    <img src="${logoUrl}" alt="Zita-Onyeka Foundation" width="46" height="46" style="display:block;border-radius:999px;background:#ffffff;padding:4px;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#f7c87b;font-weight:700;">${eyebrow}</div>
                    <h1 style="margin:8px 0 0;font-size:25px;line-height:1.25;color:#ffffff;">${title}</h1>
                  </td>
                </tr>
              </table>
            </div>
            <div style="padding:28px 26px;">
              ${content}
            </div>
          </div>
          <p style="margin:18px 4px 0;color:#7b8b86;font-size:12px;line-height:1.7;text-align:center;">
            Zita-Onyeka Foundation · Practical support for families and communities
          </p>
        </div>
      </div>
    `;
  }

  private donationAmount(donation: Donation) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: donation.currency || "NGN",
      maximumFractionDigits: 0,
    }).format(donation.amount);
  }

  async sendDonationReceiptEmail(donation: Donation) {
    if (!donation.email) return;
    const amount = this.donationAmount(donation);
    const donor = donation.anonymous ? "there" : donation.donor || "there";
    const receiptPdf = await createDonationReceiptPdfBuffer(donation);

    const html = this.donationEmailShell({
      eyebrow: "Donation receipt",
      title: "Your donation has been received",
      content: `
        <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hello ${donor},</p>
        <p style="font-size:15px;line-height:1.8;margin:0 0 22px;color:#52635e;">Thank you for giving to Zita-Onyeka Foundation. We have attached a PDF receipt for your records.</p>

        <div style="background:#f6fbf7;border:1px solid #dfe8e2;border-radius:14px;padding:18px;margin:0 0 22px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:7px 0;color:#64748b;">Amount</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#10231d;">${amount}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Status</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#10231d;text-transform:capitalize;">${
              donation.status
            }</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Method</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#10231d;text-transform:capitalize;">${
              donation.method || "paystack"
            }</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Reference</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#10231d;font-family:monospace;">${
              donation.reference
            }</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Date</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#10231d;">${formatDonationDateTime(
              donation.paidAt || donation.createdAt
            )}</td></tr>
          </table>
        </div>

        <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">Your support helps the team respond with education, relief outreach, and practical care people can use.</p>
      `,
    });

    await this.sendMail({
      to: donation.email,
      subject: "Your Zita-Onyeka Foundation donation receipt",
      html,
      text: `Thank you. Donation receipt: ${amount}, reference ${donation.reference}.`,
      attachments: [
        {
          filename: `zof-donation-receipt-${donation.reference}.pdf`,
          content: receiptPdf,
        },
      ],
    } as any);
  }

  async sendDonationThankYouEmail(donation: Donation) {
    if (!donation.email) return;
    const donor = donation.anonymous ? "there" : donation.donor || "there";
    const amount = this.donationAmount(donation);

    const html = this.donationEmailShell({
      eyebrow: "Thank you",
      title: "Your support means practical help can continue",
      content: `
        <p style="font-size:15px;line-height:1.8;margin:0 0 16px;">Hello ${donor},</p>
        <p style="font-size:15px;line-height:1.8;margin:0 0 16px;color:#52635e;">Thank you for your donation of <strong style="color:#10231d;">${amount}</strong>. We do not take your support lightly.</p>
        <p style="font-size:15px;line-height:1.8;margin:0 0 22px;color:#52635e;">Your gift helps the team organize real support for women, young people, and families who need practical care.</p>
        <div style="border-left:4px solid #f36a3d;background:#fff8ef;padding:15px 16px;border-radius:0 12px 12px 0;margin:0 0 22px;">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#52635e;">We will keep doing the careful work: listen first, respond clearly, and follow through.</p>
        </div>
        <p style="font-size:15px;line-height:1.8;margin:0;">With gratitude,<br/><strong>The Zita-Onyeka Foundation Team</strong></p>
      `,
    });

    await this.sendMail({
      to: donation.email,
      subject: "Thank you for your donation",
      html,
      text: "Thank you for giving to Zita-Onyeka Foundation.",
    });
  }
}
