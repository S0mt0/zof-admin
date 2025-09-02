"use client";

import { useRef, useTransition, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { handleFileUpload } from "@/lib/utils";
import { updateProfileImage } from "@/lib/actions/update-profile";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 8000000; // 8MB

export const ProfileImage = ({
  imgUrl = "",
  userId,
}: {
  imgUrl?: string;
  userId: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    inputRef.current?.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      toast.error("Please select only one file");
      e.target.value = "";
      return;
    }

    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use jpg, jpeg, png, or gif.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must not be more than 8MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");

    startTransition(() => {
      void (async () => {
        try {
          const objectUrl = await handleFileUpload(e, "profile");
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }

          const res = await updateProfileImage(objectUrl, userId);
          if (res?.error) {
            toast.error(res.error);
            return;
          }

          toast.success(res?.success || "Uploaded successfully");
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
          toast.dismiss(dismiss);
          e.target.value = "";
        }
      })();
    });
  };

  return (
    <div className="relative mx-auto">
      <Image
        src={imgUrl}
        alt="my profile picture"
        className="w-24 h-auto aspect-square rounded-full object-cover object-center"
        width={100}
        height={100}
        priority
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        className="hidden"
        onChange={onChange}
        multiple={false}
        disabled={isPending}
      />

      <Button
        size="sm"
        variant="outline"
        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
        onClick={onClick}
        disabled={isPending}
      >
        <Camera className="h-4 w-4" />
      </Button>
    </div>
  );
};
