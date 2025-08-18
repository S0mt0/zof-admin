import React from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Socials } from "./socials";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  description?: string;
}

export const CardWrapper = ({
  children,
  backButtonHref,
  backButtonLabel,
  headerLabel,
  showSocial,
  description,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <Image
          height={200}
          width={200}
          src={"/zof-logo.png"}
          alt="@zof-logo"
          className="w-14 h-auto mx-auto"
          priority
        />
        <CardTitle className="text-2xl font-bold text-gray-700">
          {headerLabel}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}

      <CardFooter>
        <Button variant="link" size="sm" asChild className="font-normal w-full">
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
