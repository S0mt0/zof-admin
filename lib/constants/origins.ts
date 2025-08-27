export const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://zof-admin.vercel.app";

export const FRONTEND_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://www.zitaonyekafoundation.org";
