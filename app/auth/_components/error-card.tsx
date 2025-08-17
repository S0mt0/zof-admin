"use client";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from ".";
import { FormError } from "@/components/form-error";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "AccessDenied"
      ? "Access denied! Your email is not allowed, please contact admin."
      : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        {urlError ? (
          <FormError message={urlError} showIcon={false} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <TriangleAlert className="text-destructive" />
          </div>
        )}
      </CardWrapper>
    </div>
  );
};
