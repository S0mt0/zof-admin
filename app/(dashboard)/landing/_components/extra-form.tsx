"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type RefObject,
} from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";

import { updateLandingExtraAction } from "@/lib/actions/pages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { handleFileUpload } from "@/lib/utils";

const MAX_VIDEO_SIZE = MAX_IMAGE_SIZE * 10;

type ExtraState = {
  heroImage: string;
  themeVideo: string;
  themeVideoPoster: string;
  themeVideoFile: string;
  aboutImage: string;
};

export function ExtraForm({ extra }: { extra: LandingExtraContent | null }) {
  const [isPending, startTransition] = useTransition();
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const aboutInputRef = useRef<HTMLInputElement | null>(null);
  const themeVideoInputRef = useRef<HTMLInputElement | null>(null);
  const themePosterInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState<ExtraState>({
    heroImage: extra?.heroImage || "",
    themeVideo: extra?.themeVideo || "",
    themeVideoPoster: extra?.themeVideoPoster || "",
    themeVideoFile: extra?.themeVideoFile || "",
    aboutImage: extra?.aboutImage || "",
  });

  const hasChanges =
    !extra ||
    formData.heroImage !== (extra.heroImage || "") ||
    formData.themeVideo !== (extra.themeVideo || "") ||
    formData.themeVideoPoster !== (extra.themeVideoPoster || "") ||
    formData.themeVideoFile !== (extra.themeVideoFile || "") ||
    formData.aboutImage !== (extra.aboutImage || "");

  const uploadImage = (
    e: ChangeEvent<HTMLInputElement>,
    field: "heroImage" | "aboutImage" | "themeVideoPoster"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use jpg, jpeg, png, heic, or gif.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("File size must not be more than 5MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");
    startTransition(() => {
      handleFileUpload(e, "media")
        .then((url) => {
          if (!url) return toast.error("Upload failed");
          setFormData((prev) => ({ ...prev, [field]: url }));
          toast.success("Upload successful");
        })
        .catch(() => toast.error("Upload failed"))
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
      });
    });
  };

  const uploadVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video size must not be more than 50MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading video...");
    startTransition(() => {
      handleFileUpload(e, "media")
        .then((url) => {
          if (!url) return toast.error("Upload failed");
          setFormData((prev) => ({ ...prev, themeVideoFile: url }));
          toast.success("Video uploaded");
        })
        .catch(() => toast.error("Upload failed"))
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  };

  const onSubmit = () => {
    startTransition(() => {
      updateLandingExtraAction(formData)
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
          <CardTitle>Extra Landing Assets</CardTitle>
          <CardDescription>
            Manage the hero image, theme video URL, and About section image.
          </CardDescription>
        </div>
        <Button onClick={onSubmit} disabled={isPending || !hasChanges}>
          <Save className="mr-2 h-4 w-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardHeader>
      <CardContent className="grid gap-5">
        <AssetPicker
          label="Hero Image"
          value={formData.heroImage}
          inputRef={heroInputRef}
          onUpload={(e) => uploadImage(e, "heroImage")}
          onPick={() => heroInputRef.current?.click()}
        />

        <div className="grid gap-2">
          <Label htmlFor="theme-video">Theme Video URL</Label>
          <Input
            id="theme-video"
            value={formData.themeVideo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, themeVideo: e.target.value }))
            }
            placeholder="YouTube, Vimeo, or any public video URL"
          />
        </div>

        <div className="grid gap-4 rounded-md border p-4 lg:grid-cols-[1fr_240px]">
          <div className="grid gap-2">
            <Label>Direct Theme Video</Label>
            {formData.themeVideoFile ? (
              <video
                src={formData.themeVideoFile}
                poster={formData.themeVideoPoster || undefined}
                controls
                className="h-48 w-full rounded-md bg-black object-contain"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed bg-muted text-sm text-muted-foreground">
                No direct video uploaded
              </div>
            )}
            <input
              ref={themeVideoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={uploadVideo}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => themeVideoInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {formData.themeVideoFile ? "Replace Video" : "Upload Video"}
            </Button>
          </div>

          <AssetPicker
            label="Video Poster"
            value={formData.themeVideoPoster}
            inputRef={themePosterInputRef}
            onUpload={(e) => uploadImage(e, "themeVideoPoster")}
            onPick={() => themePosterInputRef.current?.click()}
          />
        </div>

        <AssetPicker
          label="About Us Section Picture"
          value={formData.aboutImage}
          inputRef={aboutInputRef}
          onUpload={(e) => uploadImage(e, "aboutImage")}
          onPick={() => aboutInputRef.current?.click()}
        />
      </CardContent>
    </Card>
  );
}

function AssetPicker({
  label,
  value,
  inputRef,
  onUpload,
  onPick,
}: {
  label: string;
  value: string;
  inputRef: RefObject<HTMLInputElement>;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onPick: () => void;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-md border bg-muted">
        {value ? (
          <div className="relative h-40 sm:h-48">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground sm:h-48">
            No image selected
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
        className="hidden"
        onChange={onUpload}
      />
      <Button type="button" variant="outline" onClick={onPick}>
        <Upload className="mr-2 h-4 w-4" />
        {value ? "Change Image" : "Upload Image"}
      </Button>
    </div>
  );
}
