import * as z from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

export const EmailUpdateSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
});

export const PasswordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const NotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  weeklyReports: z.boolean(),
  eventReminders: z.boolean(),
});
