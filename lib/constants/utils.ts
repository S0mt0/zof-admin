const allowedAccountEmails = process.env.ALLOWED_ACCOUNT_EMAILS;
export const allowedAccountEmailsList = allowedAccountEmails?.split(",") || [];

const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS;
export const allowedAdminEmailsList = allowedAdminEmails?.split(",") || [];

const now = new Date();

export const dummyProfile: IUser = {
  name: "John Doe",
  createdAt: now,
  updatedAt: now,
  email: "john@doe.com",
  id: "dummyid",
  joinDate: now,
  bio: "",
  role: "user",
  phone: "",
  location: "",
  emailNotifications: false,
  eventReminders: false,
  weeklyReports: false,
  emailVerified: null,
  image: "",
  lastLogin: now,
  password: "",
};
