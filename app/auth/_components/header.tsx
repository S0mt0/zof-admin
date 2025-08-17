import Image from "next/image";
import React from "react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HeaderProps {
  label?: string;
  description?: string;
}

export const Header = ({ label, description }: HeaderProps) => {
  return (
    <CardHeader className="space-y-1 text-center">
      <Image
        height={200}
        width={200}
        src={"/zof-logo.png"}
        alt="@ZOF_LOGO"
        className="w-14 h-auto mx-auto"
        priority
      />
      <CardTitle className="text-2xl font-bold text-gray-700">
        {label}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
  );
};
