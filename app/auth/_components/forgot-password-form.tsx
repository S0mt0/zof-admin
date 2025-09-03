"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CardWrapper } from "./card-wrapper";
import { ForgotPasswordSchema } from "@/lib/schemas";
import { forgotPassword } from "@/lib/actions/forgot-password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      forgotPassword(values).then((data) => {
        if (data?.success) {
          setSuccess(data?.success);
          form.reset();
        }

        if (data?.error) setError(data?.error);
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <CardWrapper
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        headerLabel="Forgot your password?"
        description=" Enter your email address and we'll send you a link to reset your
            password"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="admin@zitaonyeka.org"
                        disabled={isPending}
                      />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
}
