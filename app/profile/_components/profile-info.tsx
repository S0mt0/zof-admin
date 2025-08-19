"use client";

import { Edit3, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ProfileSchema, EmailUpdateSchema } from "@/lib/schemas";
import { updateProfile, updateEmail } from "@/lib/actions/update-profile";

interface ProfileInfoProps {
  profile: IUser;
}

export const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: profile?.name?.trim() || undefined,
      phone: profile?.phone?.trim() || undefined,
      location: profile?.location?.trim() || undefined,
      bio: profile?.bio?.trim() || undefined,
    },
  });

  const emailForm = useForm<z.infer<typeof EmailUpdateSchema>>({
    resolver: zodResolver(EmailUpdateSchema),
    defaultValues: {
      email: profile?.email?.trim() || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      const hasChanges =
        values.bio !== profile?.bio ||
        values.location !== profile?.location ||
        values.name !== profile?.name ||
        values.phone !== profile?.phone;

      if (!hasChanges) {
        return; // Do nothing if values didn't change
      }

      updateProfile(values, profile?.id).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          update();
          toast.success(data.success);
          setIsEditing(false);
        }
      });
    });
  };

  const onEmailSubmit = (values: z.infer<typeof EmailUpdateSchema>) => {
    startTransition(() => {
      const hasChanges = values.email !== profile?.email;
      if (!hasChanges) {
        return; // Do nothing if value didn't change
      }

      updateEmail(values, profile?.id).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          update();
          toast.success(data.success);
          setIsEmailEditing(false);
        }
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and bio.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="default"
                  onClick={() => form.handleSubmit(onSubmit)()}
                  disabled={isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Enter your full name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Enter your phone number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Enter your location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing || isPending}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Email Update Section, if user is credentials user, and not OAuth */}
      {profile?.password && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Update your email address. You'll need to verify the new email.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEmailEditing ? (
                <>
                  <Button
                    variant="default"
                    onClick={() => emailForm.handleSubmit(onEmailSubmit)()}
                    disabled={isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEmailEditing(false);
                      emailForm.reset();
                    }}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEmailEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Change Email
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          disabled={!isEmailEditing || isPending}
                          placeholder="Enter your email address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
