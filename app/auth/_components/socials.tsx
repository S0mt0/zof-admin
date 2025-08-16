"use client";

import React from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/constants";

export const Socials = () => {
  const onClick = () => {
    signIn("google", {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={onClick}>
        <img className="h-5 w-5 object-center" src="/google-icon.png" />
      </Button>
    </div>
  );
};
