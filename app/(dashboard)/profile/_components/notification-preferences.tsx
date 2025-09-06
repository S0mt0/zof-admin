"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { NotificationPreferencesSchema } from "@/lib/schemas";
import { updateNotificationPreferences } from "@/lib/actions/update-profile";

export function NotificationPreferences({ profile }: { profile: IUser }) {
  const [_, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NotificationPreferencesSchema>>({
    resolver: zodResolver(NotificationPreferencesSchema),
    defaultValues: {
      emailNotifications: profile?.emailNotifications,
      eventReminders: profile?.eventReminders,
      weeklyReports: profile?.weeklyReports,
    },
  });

  const handleNotificationChange = (field: string, value: boolean) => {
    const updatedValues = { ...form.getValues(), [field]: value };

    startTransition(() => {
      updateNotificationPreferences(updatedValues).then((data) => {
        if (data?.error) toast.error(data.error);
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label>Email Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleNotificationChange(
                            "emailNotifications",
                            checked
                          );
                        }}
                        // disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {profile.role === "admin" && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly analytics reports
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="weeklyReports"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleNotificationChange(
                                "weeklyReports",
                                checked
                              );
                            }}
                            // disabled={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get reminders about upcoming events
                </p>
              </div>
              <FormField
                control={form.control}
                name="eventReminders"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleNotificationChange("eventReminders", checked);
                        }}
                        // disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
