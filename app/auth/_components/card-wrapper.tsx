import React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Header } from "./header";
import { Socials } from "./socials";
import { BackButton } from "./back-button";

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
      <Header label={headerLabel} description={description} />

      <CardContent>{children}</CardContent>

      {showSocial && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
