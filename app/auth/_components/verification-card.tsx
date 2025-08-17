"use client";

import { useSearchParams } from "next/navigation";
import { HashLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";

import { CardWrapper } from ".";
import { FormError } from "@/components/form-error";
import { verifyToken } from "@/lib/actions";
import { FormSuccess } from "@/components/form-success";

export const VerificationCard = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token!");
      return;
    }

    try {
      const status = await verifyToken(token);
      setError(status?.error);
      setSuccess(status?.success);
    } catch (error) {
      setError("Something went wrong!");
    }
  }, []);

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <CardWrapper
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        description="Confirming verification, please wait..."
      >
        <div className="w-full flex items-center justify-center">
          {!error && !success && <HashLoader color="green" size={25} />}
          <FormError message={error} />
          <FormSuccess message={success} />
        </div>
      </CardWrapper>
    </div>
  );
};
