import React from "react";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  BreadcrumbItem,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface DashboardHeaderProps {
  title: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function DashboardHeader({
  title = "Dashboard",
  breadcrumbs,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <Link href="/">{title}</Link>
          </BreadcrumbItem>
          {breadcrumbs?.map((crumb, index) => (
            <React.Fragment key={`${crumb.label}-${index}`}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
