"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ACCEPTED_IMAGE_TYPES, EDITORIAL_ROLES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { createMediaAction } from "@/lib/actions/media";
import { useCurrentUser } from "@/lib/hooks";
import { uploadFileToS3 } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UploadState =
  | {
      type: "photo";
      src: string;
      srcKey: string;
      alt: string;
      caption: string;
      description: string;
    }
  | {
      type: "video";
      src: string;
      srcKey: string;
      poster: string;
      posterKey: string;
      title: string;
      caption: string;
      description: string;
    };

const initialPhotoState: UploadState = {
  type: "photo",
  src: "",
  srcKey: "",
  alt: "",
  caption: "",
  description: "",
};

const initialVideoState: UploadState = {
  type: "video",
  src: "",
  srcKey: "",
  poster: "",
  posterKey: "",
  title: "",
  caption: "",
  description: "",
};

export function UploadMediaForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<UploadState>(initialPhotoState);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const canManage = !!user && EDITORIAL_ROLES.includes(user.role);

  const resetForm = () => {
    setFormData(initialPhotoState);
    setIsUploading(false);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) resetForm();
  };

  const validateFile = (file: File, mode: "image" | "video") => {
    if (mode === "image" && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported image type. Use jpg, jpeg, png, heic, or gif.");
      return false;
    }

    if (mode === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE * (mode === "video" ? 10 : 1)) {
      toast.error(
        mode === "video"
          ? "Video size must not be more than 50MB"
          : "Image size must not be more than 5MB"
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "src" | "poster"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPoster = field === "poster";
    const isValid = validateFile(
      file,
      isPoster || formData.type === "photo" ? "image" : "video"
    );

    if (!isValid) {
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    const loading = toast.loading("Uploading...");

    try {
      const uploaded = await uploadFileToS3(file, "media");

      setFormData((prev) => {
        if (field === "poster" && prev.type === "video") {
          return {
            ...prev,
            poster: uploaded.url,
            posterKey: uploaded.key,
          };
        }

        if (prev.type === "photo") {
          return { ...prev, src: uploaded.url, srcKey: uploaded.key };
        }

        return { ...prev, src: uploaded.url, srcKey: uploaded.key };
      });

      toast.success("Upload successful");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      toast.dismiss(loading);
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = () => {
    if (!canManage) {
      toast.error("Unauthorized");
      return;
    }

    const loading = toast.loading("Saving media...");

    startTransition(() => {
      createMediaAction(formData as any)
        .then((result) => {
          if (result.success) {
            toast.success(result.success);
            handleDialogChange(false);
            router.refresh();
            return;
          }

          toast.error(result.error || "Failed to save media");
        })
        .catch(() => {
          toast.error("Failed to save media");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const isDisabled = isPending || isUploading || !canManage;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload media</DialogTitle>
          <DialogDescription>
            Add photos and videos to the admin media library.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Media type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: MediaKind) =>
                setFormData(value === "photo" ? initialPhotoState : initialVideoState)
              }
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{formData.type === "photo" ? "Photo file" : "Video file"}</Label>
            <input
              ref={mediaInputRef}
              type="file"
              accept={formData.type === "photo" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => handleFileUpload(e, "src")}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => mediaInputRef.current?.click()}
              disabled={isDisabled}
              className="justify-start"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {formData.src ? "Replace file" : "Choose file"}
            </Button>
            {formData.src ? (
              <div className="overflow-hidden rounded-lg border bg-muted">
                {formData.type === "photo" ? (
                  <div className="relative aspect-video">
                    <Image
                      src={formData.src}
                      alt={"Media preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <video
                    src={formData.src}
                    controls
                    className="max-h-64 w-full bg-black"
                  />
                )}
              </div>
            ) : null}
          </div>

          {formData.type === "photo" ? (
            <div className="grid gap-2">
              <Label htmlFor="alt">Alt text</Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev.type === "photo"
                      ? { ...prev, alt: e.target.value }
                      : prev
                  )
                }
                disabled={isDisabled}
              />
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Video title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev.type === "video"
                        ? { ...prev, title: e.target.value }
                        : prev
                    )
                  }
                  disabled={isDisabled}
                />
              </div>

              <div className="grid gap-2">
                <Label>Poster image</Label>
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "poster")}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => posterInputRef.current?.click()}
                  disabled={isDisabled}
                  className="justify-start"
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {formData.poster ? "Replace poster" : "Upload poster"}
                </Button>
                {formData.poster ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={formData.poster}
                      alt={formData.title || "Poster preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={formData.caption}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, caption: e.target.value }))
              }
              disabled={isDisabled}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isDisabled}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogChange(false)}
            disabled={isDisabled}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isDisabled}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Media
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
