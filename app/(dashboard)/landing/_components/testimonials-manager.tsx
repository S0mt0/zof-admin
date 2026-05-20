"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createLandingTestimonialAction,
  deleteLandingTestimonialAction,
  updateLandingTestimonialAction,
} from "@/lib/actions/pages";
import { AlertDialog } from "@/components/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { getInitials, handleFileUpload } from "@/lib/utils";

const emptyForm = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  order: 0,
  published: true,
};

export function TestimonialsManager({
  testimonials,
}: {
  testimonials: LandingTestimonial[];
}) {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingTestimonial | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<LandingTestimonial | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyForm);
    setOpen(true);
  };

  const openEdit = (testimonial: LandingTestimonial) => {
    setTarget(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role || "",
      quote: testimonial.quote,
      avatar: testimonial.avatar || "",
      order: testimonial.order,
      published: testimonial.published,
    });
    setOpen(true);
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      handleFileUpload(e, "profile")
        .then((url) => {
          if (!url) return toast.error("Upload failed");
          setFormData((prev) => ({ ...prev, avatar: url }));
          toast.success("Upload successful");
        })
        .catch(() => toast.error("Upload failed"))
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingTestimonialAction(target.id, formData)
      : createLandingTestimonialAction(formData);

    startTransition(() => {
      action
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            setOpen(false);
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteLandingTestimonialAction(deleteTarget.id)
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            setDeleteTarget(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Manage public landing page testimonials.</CardDescription>
        </div>
        <Button onClick={openCreate} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {testimonials.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground md:col-span-2">
            No testimonials yet.
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder-user.jpg"}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={testimonial.published ? "default" : "secondary"}>
                    {testimonial.published ? "Published" : "Hidden"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {testimonial.quote}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Order {testimonial.order}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEdit(testimonial)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(testimonial)}
                    className="text-red-600 hover:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {target ? "Edit testimonial" : "Add testimonial"}
            </DialogTitle>
            <DialogDescription>
              Add quote details and an optional profile photo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={formData.avatar || "/placeholder-user.jpg"}
                  alt={formData.name || "Testimonial"}
                />
                <AvatarFallback>
                  {formData.name ? getInitials(formData.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label>Photo</Label>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                  className="hidden"
                  onChange={onAvatarChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.avatar ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Quote</Label>
              <Textarea
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                rows={5}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <Label>Published</Label>
                <Switch
                  checked={formData.published}
                  onCheckedChange={(published) =>
                    setFormData((prev) => ({ ...prev, published }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending
                ? "Saving..."
                : target
                  ? "Update Testimonial"
                  : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete testimonial from ${deleteTarget?.name}?`}
        isPending={isPending}
      />
    </Card>
  );
}
