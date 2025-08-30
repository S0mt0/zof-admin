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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { WebsiteSettingsSchema } from "@/lib/schemas";
import { updateWebsiteSettingsAction } from "@/lib/actions";

interface WebsiteSettingsProps {
  websiteSettings: IWebsiteSettings | null;
}

export const WebsiteSettings = ({ websiteSettings }: WebsiteSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof WebsiteSettingsSchema>>({
    resolver: zodResolver(WebsiteSettingsSchema),
    defaultValues: {
      maintenanceMode: websiteSettings?.maintenanceMode || false,
      blogComments: websiteSettings?.blogComments || false,
      eventRegistration: websiteSettings?.eventRegistration || false,
    },
  });

  const onSubmit = (values: z.infer<typeof WebsiteSettingsSchema>) => {
    startTransition(() => {
      updateWebsiteSettingsAction(values).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          toast.success(data.success);
          setIsEditing(false);
        }
      });
    });
  };

  const hasChanges =
    form.watch("maintenanceMode") !== websiteSettings?.maintenanceMode ||
    form.watch("blogComments") !== websiteSettings?.blogComments ||
    form.watch("eventRegistration") !== websiteSettings?.eventRegistration;

  const disabled = isPending || !hasChanges;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Website Settings</CardTitle>
          <CardDescription>
            Configure your website's appearance and functionality.
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
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset();
                }}
                disabled={disabled}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Website Settings
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maintenanceMode"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Maintenance Mode</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to temporarily disable public
                      access
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="blogComments"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Blog Comments</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Allow visitors to comment on blog posts
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="eventRegistration"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Event Registration</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable online event registration
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isEditing || isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
