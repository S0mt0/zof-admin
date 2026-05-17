"use client";

import { Edit3, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { FoundationInfoSchema } from "@/lib/schemas";
import { updateFoundationInfoAction } from "@/lib/actions/settings";
import {
  FOUNDATION_ADDRESS,
  FOUNDATION_DESCRIPTION,
  FOUNDATION_EMAIL,
  FOUNDATION_NAME,
} from "@/lib/constants";
import { FOUNDATION_PHONE } from "@/lib/constants";

interface FoundationInfoProps {
  foundationInfo: IFoundationInfo | null;
}

const socialFields = [
  { name: "facebook", label: "Facebook", placeholder: "facebook.com/foundation" },
  { name: "x", label: "X", placeholder: "@foundation" },
  { name: "instagram", label: "Instagram", placeholder: "@foundation" },
  { name: "youtube", label: "YouTube", placeholder: "youtube.com/@foundation" },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/company/foundation" },
  { name: "tiktok", label: "TikTok", placeholder: "@foundation" },
  { name: "threads", label: "Threads", placeholder: "@foundation" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "+234..." },
  { name: "telegram", label: "Telegram", placeholder: "@foundation" },
  { name: "snapchat", label: "Snapchat", placeholder: "@foundation" },
  { name: "pinterest", label: "Pinterest", placeholder: "pinterest.com/foundation" },
  { name: "medium", label: "Medium", placeholder: "medium.com/@foundation" },
] satisfies {
  name: keyof z.infer<typeof FoundationInfoSchema>;
  label: string;
  placeholder: string;
}[];

export const FoundationInfo = ({ foundationInfo }: FoundationInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FoundationInfoSchema>>({
    resolver: zodResolver(FoundationInfoSchema),
    defaultValues: {
      name: foundationInfo?.name || FOUNDATION_NAME,
      email: foundationInfo?.email || FOUNDATION_EMAIL,
      address: foundationInfo?.address || FOUNDATION_ADDRESS,
      phone: foundationInfo?.phone || FOUNDATION_PHONE,
      description: foundationInfo?.description || FOUNDATION_DESCRIPTION,
      facebook: foundationInfo?.facebook || "",
      x: foundationInfo?.x || "",
      instagram: foundationInfo?.instagram || "",
      youtube: foundationInfo?.youtube || "",
      linkedin: foundationInfo?.linkedin || "",
      tiktok: foundationInfo?.tiktok || "",
      threads: foundationInfo?.threads || "",
      whatsapp: foundationInfo?.whatsapp || "",
      telegram: foundationInfo?.telegram || "",
      snapchat: foundationInfo?.snapchat || "",
      pinterest: foundationInfo?.pinterest || "",
      medium: foundationInfo?.medium || "",
    },
  });

  const onSubmit = (values: z.infer<typeof FoundationInfoSchema>) => {
    startTransition(() => {
      updateFoundationInfoAction(values).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          toast.success(data.success);
          form.reset(values);
          setIsEditing(false);
        }
      });
    });
  };

  const hasChanges = !foundationInfo || form.formState.isDirty;

  const disabled = isPending || !hasChanges;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Foundation Information</CardTitle>
          <CardDescription>
            Update your foundation's basic information and branding.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="default"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={disabled}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending ? "Please wait..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Foundation Info
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foundation Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing || isPending}
                        placeholder="Enter foundation name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={!isEditing || isPending}
                        placeholder="Enter contact email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing || isPending}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing || isPending}
                      placeholder="Foundation address..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!isEditing || isPending}
                      placeholder="Brief description of your foundation..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">Social Contacts</h3>
                <p className="text-sm text-muted-foreground">
                  Add public handles, phone contacts, or profile links.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialFields.map((social) => (
                  <FormField
                    key={social.name}
                    control={form.control}
                    name={social.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{social.label}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!isEditing || isPending}
                            placeholder={social.placeholder}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
