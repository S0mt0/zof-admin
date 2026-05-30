type NodeEnv = "development" | "production" | "test" | "preview" | "staging";

const NODE_ENV = process.env.NODE_ENV as NodeEnv;

export const APP_URL =
  NODE_ENV === "development"
    ? "http://localhost:3000"
    : NODE_ENV === "preview" || NODE_ENV === "staging"
    ? "https://demo.admin.zitaonyekafoundation.org"
    : "https://admin.zitaonyekafoundation.org";

export const FRONTEND_BASE_URL =
  NODE_ENV === "development"
    ? "http://localhost:3001"
    : NODE_ENV === "preview" || NODE_ENV === "staging"
    ? "https://demo.admin.zitaonyekafoundation.org"
    : "https://www.zitaonyekafoundation.org";
