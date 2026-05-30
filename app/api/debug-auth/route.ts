// app/api/debug-auth-env/route.ts
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    googleClientIdPrefix:
      process.env.GOOGLE_CLIENT_ID?.slice(0, 20) ||
      process.env.AUTH_GOOGLE_ID?.slice(0, 20) ||
      null,
    hasGoogleClientSecret: Boolean(
      process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET
    ),
    nextAuthUrl: process.env.NEXTAUTH_URL || null,
    authUrl: process.env.AUTH_URL || null,
    vercelEnv: process.env.VERCEL_ENV || null,
    vercelGitBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
  });
}
