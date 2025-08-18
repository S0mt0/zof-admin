import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zita Onyeka Foundation - Admin Dashboard",
  description: "Admin dashboard for managing foundation's website content",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              {children}
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
