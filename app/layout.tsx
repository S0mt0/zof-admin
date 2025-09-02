import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Quicksand } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar/sidebar";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ZOF - Admin Dashboard",
  description: "CMS for the Zita-Onyeka Foundation's website",
};

export const viewport: Viewport = {
  userScalable: false,
  maximumScale: 1.0,
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${inter.variable}`}>
        <SessionProvider session={session}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {children}
              <Toaster closeButton={true} />
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
