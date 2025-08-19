type Role = "admin" | "rep" | "editor" | "user";

interface IUser {
  id: string;
  email: string;
  emailVerified?: Date | null;
  password?: string | null;
  name: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  image?: string | null;
  role: Role;
  joinDate: Date;
  lastLogin?: Date | null;

  emailNotifications: boolean;
  weeklyReports: boolean;
  eventReminders: boolean;

  createdAt: Date;
  updatedAt: Date;
}
