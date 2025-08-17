import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { DASHBOARD_BASE_URL } from "../constants";

export class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private sender: string;

  constructor(private appName: string = "Zita Onyeka Foundation") {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_APP_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    this.sender = `${this.appName} <${process.env.GOOGLE_APP_USER}>`;
  }

  async send(options: {
    subject: string;
    to: string;
    html?: string;
    text?: string;
  }) {
    return await this.transporter.sendMail({ ...options, from: this.sender });
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      const confirmationLink = `${DASHBOARD_BASE_URL}/auth/verify-account?token=${token}`;

      await this.send({
        subject: "Confirm your email",
        to: email,
        text: `Click the link to verify your account ${confirmationLink}`,
        html: `<p>Click <a href="${confirmationLink}">here</a> to confirm email.</p>`,
      });
    } catch (error) {
      console.error("[error_sending_account_verification_email]: ", error);
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const resetLink = `${DASHBOARD_BASE_URL}/auth/reset-password?token=${token}`;

      await this.send({
        subject: "Reset your password",
        to: email,
        text: `Click the link to reset your password ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link is valid for only 15 minutes.</p>`,
      });
    } catch (error) {
      console.error("[error_sending_password_reset_email]: ", error);
    }
  }
}
