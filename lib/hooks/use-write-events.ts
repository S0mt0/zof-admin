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
      maxAttendees: initialData?.maxAttendees || 0,
      ticketPrice: initialData?.ticketPrice || "",
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      detail: initialData?.detail || "",
      organizer: initialData?.organizer || "",
      status: initialData?.status || "draft",
      currentAttendees: initialData?.currentAttendees || 0,
      registrationRequired: initialData?.registrationRequired || false,
      bannerImage: initialData?.bannerImage || "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      excerpt: initialData?.excerpt || "",
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
  const handleNameChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  }, []);

  const handleMaxAttendeesChange = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, maxAttendees: value }));
  }, []);

  const handleDateChange = useCallback((value: Date) => {
    setFormData((prev) => ({ ...prev, date: value }));
  }, []);

  const handleTicketPriceChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, ticketPrice: value }));
  }, []);

  const handleExcerptChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, excerpt: value }));
  }, []);

  const handleDetailChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, detail: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, status: value as any }));
  }, []);

  const handleFeaturedChange = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, featured: value }));
  }, []);

  const handleRegistrationRequiredChange = useCallback((value: boolean) => {
    setFormData((prev) => ({ ...prev, registrationRequired: value }));
  }, []);

  const handleOrganizerChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, organizer: value }));
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, location: value }));
  }, []);

  const handleStartTimeChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, startTime: value }));
  }, []);

  const handleEndTimeChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, endTime: value }));
  }, []);

  const handleCurrentAttendeesChange = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, currentAttendees: value }));
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
        slug: generateSlug(payload.name),
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
                router.push(`/events/${res.data.event?.slug}`);
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
                router.push(`/events/${res.data.event?.slug}`);
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
      formData.startTime !== initialFormData.startTime ||
      formData.date !== initialFormData.date ||
      formData.endTime !== initialFormData.endTime ||
      formData.excerpt !== initialFormData.excerpt ||
      formData.currentAttendees !== initialFormData.currentAttendees ||
      formData.location !== initialFormData.location ||
      formData.ticketPrice !== initialFormData.ticketPrice ||
      formData.registrationRequired !== initialFormData.registrationRequired ||
      formData.maxAttendees !== initialFormData.maxAttendees ||
      formData.name !== initialFormData.name ||
      formData.detail !== initialFormData.detail ||
      formData.organizer !== initialFormData.organizer ||
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
    handleNameChange,
    handleExcerptChange,
    handleDetailChange,
    handleStatusChange,
    handleFeaturedChange,
    handleNewTagChange,
    addTag,
    removeTag,
    onBannerClick,
    onBannerChange,
    onSubmit,
    handleBackButton,
    handleMaxAttendeesChange,
    handleDateChange,
    handleTicketPriceChange,
    handleRegistrationRequiredChange,
    handleOrganizerChange,
    handleLocationChange,
    handleStartTimeChange,
    handleEndTimeChange,
    handleCurrentAttendeesChange,
  };
};
