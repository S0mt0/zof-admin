import { auth } from "@/auth";

export const currentUser = async () => (await auth())?.user;
export const currentUserRole = async () => (await auth())?.user.role;
