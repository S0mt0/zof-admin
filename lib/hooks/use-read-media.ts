import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { bulkDeleteMediaAction, deleteMediaAction } from "../actions/media";
import { EDITORIAL_ROLES } from "../constants";
import { useCurrentUser } from "./use-current-user";

export const useReadMedia = (media: MediaRecord[]) => {
  const [isPending, startTransition] = useTransition();
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"single" | "bulk" | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  const toggleDialog = () => setOpenDialog((current) => !current);

  const handleSelectMedia = (mediaId: string) => {
    setSelectedMedia((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const handleSelectAll = () => {
    const currentIds = media.map((item) => item.id);
    const allCurrentSelected = currentIds.every((id) =>
      selectedMedia.includes(id)
    );

    if (allCurrentSelected) {
      setSelectedMedia((prev) =>
        prev.filter((id) => !currentIds.includes(id))
      );
      return;
    }

    setSelectedMedia((prev) => [...new Set([...prev, ...currentIds])]);
  };

  const runDelete = (action: Promise<{ success?: string; error?: string }>) => {
    const loading = toast.loading("Please wait...");

    startTransition(() => {
      action
        .then((result) => {
          if (result.success) {
            toast.success(result.success);
            setSelectedMedia([]);
            setTargetId(null);
            router.refresh();
            return;
          }

          toast.error(result.error || "Something went wrong");
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          toast.dismiss(loading);
        });
    });
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    setActionType("single");
    toggleDialog();
    runDelete(deleteMediaAction(mediaId));
  };

  const handleBulkDelete = () => {
    if (!user || !EDITORIAL_ROLES.includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    setActionType("bulk");
    toggleDialog();

    if (selectedMedia.length === 0) return;
    if (selectedMedia.length === 1) {
      runDelete(deleteMediaAction(selectedMedia[0]));
      return;
    }

    runDelete(bulkDeleteMediaAction(selectedMedia));
  };

  const allCurrentSelected =
    media.length > 0 && media.every((item) => selectedMedia.includes(item.id));

  const someCurrentSelected = media.some((item) =>
    selectedMedia.includes(item.id)
  );

  const target = useMemo(
    () => media.find((item) => item.id === targetId) || null,
    [media, targetId]
  );

  return {
    isPending,
    selectedMedia,
    targetId,
    target,
    openDialog,
    actionType,
    allCurrentSelected,
    someCurrentSelected,
    handleSelectMedia,
    handleSelectAll,
    handleDeleteMedia,
    handleBulkDelete,
    setActionType,
    setTargetId,
    toggleDialog,
  };
};
