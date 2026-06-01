import type { ChangeEvent } from "react";
import { toast } from "sonner";

import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { handleFileUpload } from "@/lib/utils";

export const showActionResult =
  (fallback: string) => (res: SectionActionResult) => {
    if (res?.error) return toast.error(res.error);
    toast.success(res?.success || fallback);
  };

export function uploadSectionImage(
  event: ChangeEvent<HTMLInputElement>,
  onComplete: (url: string) => void
) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Unsupported file type. Use jpg, jpeg, png, heic, or gif.");
    event.target.value = "";
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    toast.error(
      `File size must not be more than ${MAX_IMAGE_SIZE / 1000 / 1024}MB`
    );
    event.target.value = "";
    return;
  }

  const dismiss = toast.loading("Uploading image...");

  handleFileUpload(event, "media")
    .then((url) => {
      if (!url) return toast.error("Upload failed");
      onComplete(url);
      toast.success("Image uploaded");
    })
    .catch((err) => {
      console.error("Upload error:", err);
      if (err instanceof Error) {
        if (err.message) toast.error(err.message);
        else
          toast.error(JSON.stringify(err) || "An error occurred during upload");
      } else toast.error(JSON.stringify(err) || "Unknown error occurred");
    })
    .finally(() => {
      toast.dismiss(dismiss);
      event.target.value = "";
    });
}
