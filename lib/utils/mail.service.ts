import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { APP_URL } from "../constants";
import { capitalize } from "./helpers.utils";
import { format } from "date-fns";

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
    to: string | string[];
    html?: string;
    text?: string;
  }) {
    return await this.transporter.sendMail({ ...options, from: this.sender });
  }

  async sendVerificationEmail(email: string, token: string) {
    try {
      const confirmationLink = `${APP_URL}/auth/verify-account?token=${token}`;

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
      const resetLink = `${APP_URL}/auth/reset-password?token=${token}`;

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

  async sendBlogBulkDeleteEmail(
    deletedBy: { name: string; role: string },
    to: string | string[],
    deleteCount?: number
  ) {
    const now = new Date();

    const text = `Hello there,

    Be informed that ${deleteCount} blog posts have just been deleted by ${
      deletedBy.role === "admin" ? "an administrator" : "an editor"
    }, ${capitalize(deletedBy.name!)}.
    
    Delete Summary:
    - No. Of Blogs Deleted: ${deleteCount || 0}
    - Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})
    - Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
    
    Best regards,
    The Editorial Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello there,</p>
      <p>
        Be informed that ${deleteCount} blog posts have just been deleted by ${
      deletedBy.role === "admin" ? "an administrator" : "an editor"
    }, ${capitalize(deletedBy.name!)}.
      </p>
      
      <div style="margin: 24px 0;">
        <strong>Delete Summary:</strong><br/>
        No. Of Blogs Deleted: ${deleteCount || 0}<br/>
        Deleted By: ${capitalize(deletedBy.name!)} (${deletedBy.role})<br/>
        Deleted On: ${format(now, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}
      </div>
  
      <p>Best regards,<br/>The Editorial Team</p>
    </div>
  `;

    try {
      await this.send({
        subject: "Multiple blog posts deleted",
        to,
        text,
        html,
      });
    } catch (error) {
      console.error("[error_sending_blog_bulk_delete_email]: ", error);
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
        If you did not request or expect this delete action, you may want to <a href="mailto:onyekazita@gmail.com">contact admin</a> or <a href="mailto:onyekazita@gmail.com">support team</a>.
      </p>
  
      <p>Best regards,<br/>The Editorial Team</p>
    </div>
  `;

    try {
      await this.send({
        subject: "Notice on your deleted blog post",
        to: deletedBlog.author?.email!,
        text,
        html,
      });
    } catch (error) {
      console.error("[error_sending_blog_update_email]: ", error);
    }
  }

  async sendBlogUpdateEmail(
    updatedBy: { name: string; role: string },
    updatedBlog: Blog
  ) {
    const text = `Hello ${updatedBlog?.author?.name || "there"},

    Your blog post titled "${updatedBlog.title}" was updated by ${
      updatedBy.role === "admin" ? "an administrator" : "an editor"
    }, ${capitalize(updatedBy.name!)} on ${format(
      updatedBlog.updatedAt,
      "EEEE, MMMM d, yyyy 'at' h:mmaaa"
    )}.
    
    Update Summary:
    - Blog Title: ${updatedBlog.title}
    - Author: ${updatedBlog?.author?.name || "Unknown"}
    - Edited By: ${capitalize(updatedBy.name!)} (${updatedBy.role})
    - Updated On: ${format(
      updatedBlog.updatedAt,
      "EEEE, MMMM d, yyyy 'at' h:mmaaa"
    )}
    
    View the changes here: ${APP_URL}/blogs/${updatedBlog.slug}
    
    Best regards,
    The Editorial Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hello ${updatedBlog.author?.name || "there"},</p>
      <p>
        Your blog post titled 
        <strong>"${updatedBlog.title}"</strong> was updated by 
        ${updatedBy.role === "admin" ? "an administrator" : "an editor"}, 
        <strong>${capitalize(updatedBy.name!)}</strong> on 
        ${format(updatedBlog.updatedAt, "EEEE, MMMM d, yyyy 'at' h:mmaaa")}.
      </p>
      
      <div style="margin: 24px 0;">
        <strong>Update Summary:</strong><br/>
        Blog Title: ${updatedBlog.title}<br/>
        Author: ${updatedBlog.author?.name || "Unknown"}<br/>
        Updated By: ${capitalize(updatedBy.name!)} (${updatedBy.role})<br/>
        Updated On: ${format(
          updatedBlog.updatedAt,
          "EEEE, MMMM d, yyyy 'at' h:mmaaa"
        )}
      </div>
  
      <p>
        If you did not request or expect this update, you may want to review the changes.
      </p>
  
      <p style="margin: 20px 0;">
        <a href="${APP_URL}/blogs/${updatedBlog.slug}" 
           style="background: #16A249; color: white; text-decoration: none; padding: 10px 16px; border-radius: 4px; display: inline-block;">
           View Changes
        </a>
      </p>
  
      <p>Best regards,<br/>The Editorial Team</p>
    </div>
  `;

    try {
      await this.send({
        subject: "Review changes to your blog post",
        to: updatedBlog.author?.email!,
        text,
        html,
      });
    } catch (error) {
      console.error("[error_sending_blog_update_email]: ", error);
    }
  }
}
