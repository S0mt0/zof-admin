"use client";

import React from "react";

import { Button } from "@/components/ui/button";

export const Socials = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className="w-full" variant="outline" onClick={() => {}}>
        <img className="h-5 w-5 object-center" src="/google-icon.png" />
      </Button>
    </div>
  );
};
