"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { Edit, Plus, Star, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { SortableList } from "@/components/common/sortable-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  createVolunteerAction,
  deleteVolunteerAction,
  reorderVolunteersAction,
  updateVolunteerAction,
} from "@/lib/actions/team";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { getInitials, handleFileUpload } from "@/lib/utils";

type VolunteerFormState = {
  name: string;
  volunteerType: string;
  featured: boolean;
  avatar: string;
  facebook: string;
  x: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  threads: string;
  whatsapp: string;
  telegram: string;
  snapchat: string;
  pinterest: string;
  medium: string;
};

const initialFormState: VolunteerFormState = {
  name: "",
  volunteerType: "",
  featured: false,
  avatar: "",
  facebook: "",
  x: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  tiktok: "",
  threads: "",
  whatsapp: "",
  telegram: "",
  snapchat: "",
  pinterest: "",
  medium: "",
};

const socialFields = [
  { name: "facebook", label: "Facebook", placeholder: "facebook.com/name" },
  { name: "x", label: "X", placeholder: "@name" },
  { name: "instagram", label: "Instagram", placeholder: "@name" },
  { name: "youtube", label: "YouTube", placeholder: "youtube.com/@name" },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/name" },
  { name: "tiktok", label: "TikTok", placeholder: "@name" },
  { name: "threads", label: "Threads", placeholder: "@name" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "+234..." },
  { name: "telegram", label: "Telegram", placeholder: "@name" },
  { name: "snapchat", label: "Snapchat", placeholder: "@name" },
  { name: "pinterest", label: "Pinterest", placeholder: "pinterest.com/name" },
  { name: "medium", label: "Medium", placeholder: "medium.com/@name" },
] satisfies {
  name: keyof VolunteerFormState;
  label: string;
  placeholder: string;
}[];

const getInitialFormState = (volunteer: Volunteer | null): VolunteerFormState =>
  volunteer
    ? {
        name: volunteer.name || "",
        volunteerType: volunteer.volunteerType || "",
        featured: Boolean(volunteer.featured),
        avatar: volunteer.avatar || "",
        facebook: volunteer.facebook || "",
        x: volunteer.x || "",
        instagram: volunteer.instagram || "",
        youtube: volunteer.youtube || "",
        linkedin: volunteer.linkedin || "",
        tiktok: volunteer.tiktok || "",
        threads: volunteer.threads || "",
        whatsapp: volunteer.whatsapp || "",
        telegram: volunteer.telegram || "",
        snapchat: volunteer.snapchat || "",
        pinterest: volunteer.pinterest || "",
        medium: volunteer.medium || "",
      }
    : initialFormState;

export function Volunteers({ volunteers }: { volunteers: Volunteer[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [target, setTarget] = useState<Volunteer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Volunteer | null>(null);
  const [formData, setFormData] =
    useState<VolunteerFormState>(initialFormState);

  const visibleSocialCount = useMemo(
    () =>
      volunteers.reduce(
        (count, volunteer) =>
          count +
          socialFields.filter((field) => Boolean(volunteer[field.name])).length,
        0
      ),
    [volunteers]
  );

  const openCreateForm = () => {
    setTarget(null);
    setFormData(initialFormState);
    setOpenForm(true);
  };

  const openEditForm = (volunteer: Volunteer) => {
    setTarget(volunteer);
    setFormData(getInitialFormState(volunteer));
    setOpenForm(true);
  };

  const updateField = (
    name: keyof VolunteerFormState,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      toast.error("File size must not be more than 5MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");

    startTransition(() => {
      handleFileUpload(e, "profile")
        .then((objectUrl) => {
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }

          updateField("avatar", objectUrl);
          toast.success("Upload successful");
        })
        .catch(() => {
          toast.error("Upload failed");
        })
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  };

  const onSubmit = () => {
    const action = target
      ? updateVolunteerAction(target.id, formData)
      : createVolunteerAction(formData);

    startTransition(() => {
      action
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }

          if (res?.success) {
            toast.success(res.success);
            setOpenForm(false);
            setTarget(null);
            setFormData(initialFormState);
            router.refresh();
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;

    startTransition(() => {
      deleteVolunteerAction(deleteTarget.id)
        .then((res) => {
          if (res?.error) {
            toast.error(res.error);
            return;
          }

          if (res?.success) {
            toast.success(res.success);
            setDeleteTarget(null);
            router.refresh();
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Card id="volunteers">
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Volunteers</CardTitle>
          <CardDescription>
            Manage volunteer records and optional social contacts.
          </CardDescription>
        </div>
        <Button onClick={openCreateForm} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Add Volunteer
        </Button>
      </CardHeader>

      <CardContent>
        {volunteers.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No volunteers have been added yet.
          </div>
        ) : (
          <SortableList
            items={volunteers}
            onReorder={reorderVolunteersAction}
            renderItem={(volunteer, dragHandle) => {
              const visibleSocials = socialFields.filter((field) =>
                Boolean(volunteer[field.name])
              );

              return (
                <Card key={volunteer.id} className="overflow-hidden border-border/70">
                  <div className="flex items-center gap-3 p-3">
                    <div className="shrink-0">{dragHandle}</div>
                    <Avatar className="h-12 w-12 shrink-0 rounded-xl">
                      <AvatarImage
                        src={volunteer.avatar || "/placeholder-user.jpg"}
                        alt={volunteer.name}
                      />
                      <AvatarFallback>{getInitials(volunteer.name)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <CardTitle className="truncate text-base">
                            {volunteer.name}
                          </CardTitle>
                          <CardDescription className="truncate text-xs">
                            {volunteer.volunteerType}
                          </CardDescription>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {volunteer.featured ? (
                            <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                              <Star className="h-3 w-3 fill-current" />
                              Featured
                            </Badge>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditForm(volunteer)}
                            disabled={isPending}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(volunteer)}
                            disabled={isPending}
                            className="text-red-600 hover:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          Added {new Date(volunteer.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {visibleSocials.slice(0, 5).map((field) => (
                          <Badge key={field.name} variant="outline" className="text-[0.65rem]">
                            {field.label}
                          </Badge>
                        ))}
                        {visibleSocials.length > 5 ? (
                          <Badge variant="secondary" className="text-[0.65rem]">
                            +{visibleSocials.length - 5}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            }}
          />
        )}
      </CardContent>

      {volunteers.length > 0 ? (
        <CardFooter className="border-t text-sm text-muted-foreground">
          {volunteers.length} volunteer(s), {visibleSocialCount} social
          contact(s)
        </CardFooter>
      ) : null}

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {target ? "Edit volunteer" : "Add volunteer"}
            </DialogTitle>
            <DialogDescription>
              Add the volunteer type and any public social contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={formData.avatar || "/placeholder-user.jpg"}
                  alt={formData.name || "Volunteer"}
                />
                <AvatarFallback>
                  {formData.name ? getInitials(formData.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 space-x-2">
                <Label>Profile Photo</Label>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                  className="hidden"
                  onChange={onAvatarChange}
                  multiple={false}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isPending}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.avatar ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="volunteer-name">Name</Label>
                <Input
                  id="volunteer-name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={isPending}
                  placeholder="Volunteer name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="volunteer-type">Type of Volunteer</Label>
                <Input
                  id="volunteer-type"
                  value={formData.volunteerType}
                  onChange={(e) => updateField("volunteerType", e.target.value)}
                  disabled={isPending}
                  placeholder="e.g., Event volunteer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
              <div>
                <Label>Featured volunteer</Label>
                <p className="text-xs text-muted-foreground">
                  Only one volunteer can hold the large landing-page feature.
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(featured) =>
                  updateField("featured", featured)
                }
                disabled={isPending}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {socialFields.map((field) => (
                <div key={field.name} className="grid gap-2">
                  <Label htmlFor={`volunteer-${field.name}`}>
                    {field.label}
                  </Label>
                  <Input
                    id={`volunteer-${field.name}`}
                    value={formData[field.name]}
                    onChange={(e) => updateField(field.name, e.target.value)}
                    disabled={isPending}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenForm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="button" onClick={onSubmit} disabled={isPending}>
              {isPending
                ? "Please wait..."
                : target
                ? "Update Volunteer"
                : "Add Volunteer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Are you sure you want to remove ${deleteTarget?.name} from volunteers?`}
        isPending={isPending}
      />
    </Card>
  );
}
