"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateMediaAction } from "@/lib/actions/media";
import { EDITORIAL_ROLES } from "@/lib/constants";
import { useCurrentUser } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type EditState =
  | {
      type: "photo";
      alt: string;
      caption: string;
      description: string;
    }
  | {
      type: "video";
      title: string;
      caption: string;
      description: string;
    };

const getInitialState = (item: MediaRecord): EditState =>
  item.type === "photo"
    ? {
        type: "photo",
        alt: item.alt || "",
        caption: item.caption || "",
        description: item.description || "",
      }
    : {
        type: "video",
        title: item.title || "",
        caption: item.caption || "",
        description: item.description || "",
      };

export function EditMediaForm({
  item,
  open,
  onOpenChange,
}: {
  item: MediaRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const user = useCurrentUser();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<EditState | null>(
    item ? getInitialState(item) : null
  );

  const canManage = !!user && EDITORIAL_ROLES.includes(user.role);

  useEffect(() => {
    setFormData(item ? getInitialState(item) : null);
  }, [item]);

  const onSubmit = () => {
    if (!item || !formData) return;

    if (!canManage) {
      toast.error("Unauthorized");
      return;
    }

    const loading = toast.loading("Saving changes...");

    startTransition(() => {
      updateMediaAction({
        id: item.id,
        ...formData,
      })
        .then((result) => {
          if (result.success) {
            toast.success(result.success);
            onOpenChange(false);
            router.refresh();
            return;
          }

          toast.error(result.error || "Failed to update media");
        })
        .catch(() => {
          toast.error("Failed to update media");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const isDisabled = isPending || !canManage || !item || !formData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit media</DialogTitle>
          <DialogDescription>
            Update the text details shown across the media library.
          </DialogDescription>
        </DialogHeader>

        {item && formData ? (
          <div className="grid gap-4">
            {formData.type === "photo" ? (
              <div className="grid gap-2">
                <Label htmlFor="edit-alt">Alt text</Label>
                <Input
                  id="edit-alt"
                  value={formData.alt}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev?.type === "photo"
                        ? { ...prev, alt: e.target.value }
                        : prev
                    )
                  }
                  disabled={isDisabled}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev?.type === "video"
                        ? { ...prev, title: e.target.value }
                        : prev
                    )
                  }
                  disabled={isDisabled}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="edit-caption">Caption</Label>
              <Input
                id="edit-caption"
                value={formData.caption}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, caption: e.target.value } : prev
                  )
                }
                disabled={isDisabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                disabled={isDisabled}
                rows={4}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} disabled={isDisabled}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
