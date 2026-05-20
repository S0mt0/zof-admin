"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { updateAboutPageAction } from "@/lib/actions/pages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  aboutUs: "",
  vision: "",
  mission: "",
};

export function AboutPageForm({
  content,
}: {
  content: AboutPageContent | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    aboutUs: content?.aboutUs || "",
    vision: content?.vision || "",
    mission: content?.mission || "",
  });

  const hasChanges =
    !content ||
    formData.aboutUs !== content.aboutUs ||
    formData.vision !== content.vision ||
    formData.mission !== content.mission;

  const updateField = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    startTransition(() => {
      updateAboutPageAction(formData)
        .then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) toast.success(res.success);
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>About Us</CardTitle>
          <CardDescription>
            Edit the main public About page copy for the NGO.
          </CardDescription>
        </div>
        <Button onClick={onSubmit} disabled={isPending || !hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="about-us">About Us</Label>
          <Textarea
            id="about-us"
            value={formData.aboutUs}
            onChange={(e) => updateField("aboutUs", e.target.value)}
            rows={7}
            placeholder="Tell visitors about the foundation..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => updateField("vision", e.target.value)}
              rows={5}
              placeholder="Describe the foundation's vision..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => updateField("mission", e.target.value)}
              rows={5}
              placeholder="Describe the foundation's mission..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
