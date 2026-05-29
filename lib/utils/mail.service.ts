import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { format } from "date-fns";
import { type CreateEmailOptions, Resend } from "resend";

import { APP_URL } from "../constants";
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

  private donationEmailShell(content: string) {
    return `
      <div style="margin:0;padding:0;background:#f6fbf7;font-family:Arial,sans-serif;color:#10231d;">
        <div style="max-width:640px;margin:0 auto;padding:32px 18px;">
          <div style="background:#173f35;color:#fff;padding:24px;border-radius:16px 16px 0 0;">
            <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#f7c87b;font-weight:700;">Zita-Onyeka Foundation</div>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;">Thank you for supporting the work</h1>
          </div>
          <div style="background:#fff;border:1px solid #dfe8e2;border-top:0;padding:26px;border-radius:0 0 16px 16px;">
            ${content}
          </div>
        </div>
      </div>
    `;
  }

  async sendDonationReceiptEmail(donation: Donation) {
    if (!donation.email) return;
    const amount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: donation.currency || "NGN",
      maximumFractionDigits: 0,
    }).format(donation.amount);

    const html = this.donationEmailShell(`
      <p style="font-size:15px;line-height:1.8;margin:0 0 18px;">Hello ${donation.anonymous ? "there" : donation.donor || "there"},</p>
      <p style="font-size:15px;line-height:1.8;margin:0 0 22px;">We have received your donation. Please keep this receipt for your records.</p>
      <div style="background:#f6fbf7;border:1px solid #dfe8e2;border-radius:12px;padding:18px;margin:20px 0;">
        <p style="margin:0 0 8px;"><strong>Amount:</strong> ${amount}</p>
        <p style="margin:0 0 8px;"><strong>Status:</strong> ${donation.status}</p>
        <p style="margin:0 0 8px;"><strong>Reference:</strong> ${donation.reference}</p>
        <p style="margin:0;"><strong>Date:</strong> ${format(new Date(donation.paidAt || donation.createdAt), "MMMM d, yyyy")}</p>
      </div>
      <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">Your support helps us keep practical care moving through education, relief outreach, and community programs.</p>
    `);

    await this.sendMail({
      to: donation.email,
      subject: "Your donation receipt",
      html,
      text: `Thank you. Donation receipt: ${amount}, reference ${donation.reference}.`,
    });
  }

  async sendDonationThankYouEmail(donation: Donation) {
    if (!donation.email) return;
    const html = this.donationEmailShell(`
      <p style="font-size:15px;line-height:1.8;margin:0 0 18px;">Hello ${donation.anonymous ? "there" : donation.donor || "there"},</p>
      <p style="font-size:15px;line-height:1.8;margin:0 0 18px;">Thank you for giving to Zita-Onyeka Foundation. We do not take your support lightly.</p>
      <p style="font-size:15px;line-height:1.8;margin:0 0 18px;">Your gift helps the team respond with support people can actually use.</p>
      <p style="font-size:15px;line-height:1.8;margin:0;">With gratitude,<br/><strong>The Zita-Onyeka Foundation Team</strong></p>
    `);

    await this.sendMail({
      to: donation.email,
      subject: "Thank you for your donation",
      html,
      text: "Thank you for giving to Zita-Onyeka Foundation.",
    });
  }

}
