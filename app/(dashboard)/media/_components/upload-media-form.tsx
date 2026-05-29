"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import { ExternalLink, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  ACCEPTED_IMAGE_TYPES,
  EDITORIAL_ROLES,
  MAX_IMAGE_SIZE,
} from "@/lib/constants";
import { createManyMediaAction, createMediaAction } from "@/lib/actions/media";
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
      files: UploadedPhoto[];
      alt: string;
      caption: string;
      description: string;
    }
  | {
      type: "video";
      sourceMode: "upload" | "youtube";
      youtubeUrl: string;
      src: string;
      srcKey: string;
      poster: string;
      posterKey: string;
      title: string;
      caption: string;
      description: string;
    };

type UploadedPhoto = {
  src: string;
  srcKey: string;
  name: string;
};

const initialPhotoState: UploadState = {
  type: "photo",
  src: "",
  srcKey: "",
  files: [],
  alt: "",
  caption: "",
  description: "",
};

const initialVideoState: UploadState = {
  type: "video",
  sourceMode: "upload",
  youtubeUrl: "",
  src: "",
  srcKey: "",
  poster: "",
  posterKey: "",
  title: "",
  caption: "",
  description: "",
};

const getYoutubeVideoId = (value: string) => {
  try {
    const url = new URL(value.trim());
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/")[1] || "";
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
    if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] || "";
    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
};

const getYoutubeThumbnail = (value: string) => {
  const id = getYoutubeVideoId(value);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
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
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const isPoster = field === "poster";
    const isPhotoUpload = field === "src" && formData.type === "photo";
    const files = isPhotoUpload
      ? selectedFiles.slice(0, 10)
      : selectedFiles.slice(0, 1);

    if (isPhotoUpload && selectedFiles.length > 10) {
      toast.error("You can upload up to 10 photos at once.");
      e.target.value = "";
      return;
    }

    const isValid = files.every((file) =>
      validateFile(file, isPoster || isPhotoUpload ? "image" : "video")
    );

    if (!isValid) {
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    const loading = toast.loading("Uploading...");

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const uploaded = await uploadFileToS3(file, "media");
          return { src: uploaded.url, srcKey: uploaded.key, name: file.name };
        })
      );

      setFormData((prev) => {
        const [uploaded] = uploadedFiles;

        if (field === "poster" && prev.type === "video") {
          return {
            ...prev,
            poster: uploaded.src,
            posterKey: uploaded.srcKey,
          };
        }

        if (prev.type === "photo") {
          return {
            ...prev,
            files: uploadedFiles,
            src: uploaded.src,
            srcKey: uploaded.srcKey,
          };
        }

        return { ...prev, src: uploaded.src, srcKey: uploaded.srcKey };
      });

      toast.success(
        uploadedFiles.length > 1
          ? `${uploadedFiles.length} photos uploaded`
          : "Upload successful"
      );
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      toast.dismiss(loading);
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleYoutubeUrlChange = (youtubeUrl: string) => {
    setFormData((prev) => {
      if (prev.type !== "video") return prev;
      const poster = getYoutubeThumbnail(youtubeUrl);
      return {
        ...prev,
        sourceMode: "youtube",
        youtubeUrl,
        src: youtubeUrl,
        srcKey: youtubeUrl ? `external:${youtubeUrl}` : "",
        poster,
        posterKey: poster ? `external:${poster}` : "",
      };
    });
  };

  const onSubmit = () => {
    if (!canManage) {
      toast.error("Unauthorized");
      return;
    }

    if (formData.type === "video" && formData.sourceMode === "youtube") {
      if (!getYoutubeVideoId(formData.youtubeUrl)) {
        toast.error("Enter a valid YouTube URL.");
        return;
      }
    }

    const loading = toast.loading("Saving media...");

    startTransition(() => {
      const action =
        formData.type === "photo"
          ? createManyMediaAction(
              formData.files.map((file) => ({
                type: "photo",
                src: file.src,
                srcKey: file.srcKey,
                alt: formData.alt,
                caption: formData.caption,
                description: formData.description,
              }))
            )
          : createMediaAction(formData as any);

      action
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
  const isYoutubeVideo = formData.type === "video" && formData.sourceMode === "youtube";

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload media</DialogTitle>
          <DialogDescription>
            Add photos, uploaded videos, or YouTube videos to the media library.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label>Media type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: MediaKind) =>
                setFormData(
                  value === "photo" ? initialPhotoState : initialVideoState
                )
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

          {formData.type === "video" ? (
            <div className="grid gap-2">
              <Label>Video source</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-1">
                {(["upload", "youtube"] as const).map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={formData.sourceMode === mode ? "default" : "ghost"}
                    onClick={() =>
                      setFormData({
                        ...initialVideoState,
                        sourceMode: mode,
                      } as UploadState)
                    }
                    disabled={isDisabled}
                    className="capitalize"
                  >
                    {mode === "upload" ? "Upload video" : "YouTube link"}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {isYoutubeVideo ? (
            <div className="grid gap-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(event) => handleYoutubeUrlChange(event.target.value)}
                placeholder="https://youtu.be/..."
                disabled={isDisabled}
              />
              {formData.poster ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={formData.poster}
                    alt="YouTube thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
                      <ExternalLink className="h-4 w-4" />
                      YouTube video
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label>{formData.type === "photo" ? "Photo file" : "Video file"}</Label>
              <input
                ref={mediaInputRef}
                type="file"
                accept={formData.type === "photo" ? "image/*" : "video/*"}
                multiple={formData.type === "photo"}
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
                {formData.type === "photo"
                  ? formData.files.length > 0
                    ? "Replace photos"
                    : "Choose up to 10 photos"
                  : formData.src
                    ? "Replace file"
                    : "Choose file"}
              </Button>
              {formData.src ? (
                <div className="overflow-hidden rounded-lg border bg-muted">
                  {formData.type === "photo" ? (
                    <div className="grid max-h-80 gap-2 overflow-y-auto p-2 sm:grid-cols-2">
                      {formData.files.map((file) => (
                        <div
                          key={file.srcKey}
                          className="relative aspect-video overflow-hidden rounded-md bg-background"
                        >
                          <Image
                            src={file.src}
                            alt={formData.alt || file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
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
          )}

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

              {!isYoutubeVideo ? (
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
              ) : null}
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
