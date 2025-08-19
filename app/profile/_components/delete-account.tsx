"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteAccount } from "@/lib/actions";

export function DeleteAccount({ userId }: { userId: string }) {
  const [showWarning, setShowWarning] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteAccount = () => {
    startTransition(() => {
      deleteAccount(userId).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.success(
            "Account deleted successfully. Redirecting to login..."
          );
        }
      });
    });
  };

  if (showWarning) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Are you absolutely sure? This action cannot be undone. This will
              permanently delete your account and remove all your data from our
              servers.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isPending ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Delete Account</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={() => setShowWarning(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
