"use client";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from ".";
import { FormError } from "@/components/form-error";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";

  switch (error) {
    case "AccessDenied":
      errorMessage =
        "This email is not authorized to access this application. Please contact admin.";
      break;
    case "OAuthAccountNotLinked":
      errorMessage =
        "This email is already associated with a different account. Please sign in with the original method you used to create your account.";
      break;
    case "Configuration":
      errorMessage =
        "Please check your internet connection, or refresh your browser and try again.";
      break;

    default:
      errorMessage = "An unexpected error occurred. Please try again.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        {errorMessage ? (
          <FormError message={errorMessage} showIcon={false} />
        ) : (
          <div className="w-full flex items-center justify-center">
            <TriangleAlert className="text-destructive" />
          </div>
        )}
      </CardWrapper>
    </div>
  );
};
