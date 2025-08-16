type Role = "admin" | "rep" | "editor" | "cto";

interface IUser {
  id: string;
  email: string;
  emailVerified?: Date;
  password?: string;
  name: string;
  phone: string;
  location: string;
  bio: string;
  image?: string;
  role: Role;
  joinDate: Date;
  lastLogin: Date;

  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  eventReminders: boolean;

  createdAt: Date;
  updatedAt: Date;
}
