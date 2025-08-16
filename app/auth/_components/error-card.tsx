import { TriangleAlert } from "lucide-react";

import { CardWrapper } from ".";

export const ErrorCard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
      >
        <div className="w-full flex items-center justify-center">
          <TriangleAlert className="text-destructive" />
        </div>
      </CardWrapper>
    </div>
  );
};
