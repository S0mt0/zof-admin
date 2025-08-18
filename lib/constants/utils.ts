const allowedAccountEmails = process.env.ALLOWED_ACCOUNT_EMAILS;
export const allowedAccountEmailsList = allowedAccountEmails?.split(",") || [];

const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS;
export const allowedAdminEmailsList = allowedAdminEmails?.split(",") || [];
