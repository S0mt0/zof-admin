import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  useCallback,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { EventFormSchema } from "@/lib/schemas";

import { createEventAction, updateEventAction } from "@/lib/actions/events";
import { generateSlug, handleFileUpload } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "../constants";

interface EventFormData extends z.infer<typeof EventFormSchema> {
  newTag: string;
}

export const useWriteEvents = ({
  initialData,
  mode,
}: {
  initialData?: IEvent | null;
  mode: "create" | "edit";
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize form data
  const initialFormData: EventFormData = useMemo(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      status: initialData?.status || "draft",
      currentAttendees: initialData?.currentAttendees || 0,
      registrationRequired: initialData?.registrationRequired || false,
      bannerImage: initialData?.bannerImage || "",
      startTime: initialData?.startTime || "",
      location: initialData?.location || "",
      featured: initialData?.featured || false,
      tags: initialData?.tags || [],
      date: initialData?.date || new Date(),
      newTag: "",
    }),
    [initialData]
  );

  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isPending, startTransition] = useTransition();
  const [submitType, setSubmitType] = useState<EventStatus>("draft");

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Individual field handlers to prevent unnecessary re-renders
  const handleTitleChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, title: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, status: value as any }));
  }, []);

  const handleFeaturedChange = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, featured: value }));
  }, []);

  const handleNewTagChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, newTag: value }));
  }, []);

  const addTag = useCallback(() => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  }, [formData.newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const onBannerClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onBannerChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      toast.error("Please select only one file");
      e.target.value = "";
      return;
    }

    const file = files[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use jpg, jpeg, png, heic, or gif.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("File size must not be more than 8MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");
    startTransition(() => {
      handleFileUpload(e, "events")
        .then((objectUrl) => {
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }
          toast.success("Upload successful");
          setFormData((prev) => ({
            ...prev,
            bannerImage: objectUrl || prev.bannerImage,
          }));
        })
        .catch(() => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const validationResult = EventFormSchema.safeParse(formData);

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message);
        return;
      }

      const payload = validationResult.data;

      const submissionData = {
        ...payload,
        date: new Date(payload.date),
        status: submitType,
      };

      const loading = toast.loading("Please wait...");
      startTransition(() => {
        if (mode === "create") {
          createEventAction(submissionData)
            .then((res) => {
              if (res?.error) {
                toast.error(res.error);
              } else if (res?.success) {
                toast.success(res.success);
                router.push(`/events/${res.data.event?.id}`);
              }
            })
            .catch(() => {
              toast.error("Failed to create event");
            })
            .finally(() => {
              toast.dismiss(loading);
            });
        } else if (mode === "edit" && initialData?.id) {
          updateEventAction(initialData.id, submissionData)
            .then((res) => {
              if (res?.error) {
                toast.error(res.error);
              } else if (res?.success) {
                toast.success(res.success);
                router.push(`/events/${res.data.event?.id}`);
              }
            })
            .catch(() => {
              toast.error("Failed to update event");
            })
            .finally(() => {
              toast.dismiss(loading);
            });
        }
      });
    },
    [formData, submitType, mode, initialData?.id]
  );

  // Check for changes comparison
  const hasChanges = useMemo(() => {
    const arraysEqual = (a: string[] = [], b: string[] = []) =>
      a.length === b.length && a.every((v, i) => v === b[i]);

    return (
      formData.title !== initialFormData.title ||
      formData.description !== initialFormData.description ||
      formData.content !== initialFormData.content ||
      formData.status !== initialFormData.status ||
      formData.bannerImage !== initialFormData.bannerImage ||
      formData.featured !== initialFormData.featured ||
      !arraysEqual(formData.tags, initialFormData.tags)
    );
  }, [formData, initialFormData]);

  const handleBackButton = () => router.push("/events");

  return {
    formRef,
    inputRef,
    formData,
    isPending,
    submitType,
    hasChanges,
    setSubmitType,
    handleTitleChange,
    handleDescriptionChange,
    handleContentChange,
    handleStatusChange,
    handleFeaturedChange,
    handleNewTagChange,
    addTag,
    removeTag,
    onBannerClick,
    onBannerChange,
    onSubmit,
    handleBackButton,
  };
};
