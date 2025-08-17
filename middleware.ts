import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicApiRoutes,
  publicRoutes,
} from "./lib/constants";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (isApiAuthRoute) return null;
  if (isPublicRoute) return null;
  if (isPublicApiRoute) return null; // The main website (i.e. zitaonyekafoundation.org) will hit these endpoints for data.

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn && !isAuthRoute)
    return Response.redirect(new URL("/auth/login", nextUrl));

  return null;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
