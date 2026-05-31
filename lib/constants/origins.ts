import { isDevelopment, isPreview } from "./utils";

export const APP_URL =
  process.env.APP_URL ||
  (isDevelopment
    ? "http://localhost:3000"
    : isPreview
    ? "https://demo.admin.zitaonyekafoundation.org"
    : "https://admin.zitaonyekafoundation.org");

export const FRONTEND_BASE_URL =
  process.env.FRONTEND_BASE_URL ||
  (isDevelopment
    ? "http://localhost:3001"
    : isPreview
    ? "https://demo.zitaonyekafoundation.org"
    : "https://zitaonyekafoundation.org");
