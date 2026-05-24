"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  PublishSwitch,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { SortableList } from "@/components/common/sortable-list";

import {
  createTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialsAction,
  updateTestimonialAction,
} from "@/lib/actions/pages/landing/testimonials.actions";
import { uploadLandingImage } from "@/lib/pages/landing";
import { getInitials } from "@/lib/utils";

import { ItemCard } from "@/components/common/item-card";
import { ItemManagerShell } from "@/components/common/item-manager-shell";

const emptyTestimonialForm = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  published: true,
};

export function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(emptyTestimonialForm);
  const [isPending, startTransition] = useTransition();
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyTestimonialForm);
    setOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setTarget(item);
    setFormData({
      name: item.name,
      role: item.role || "",
      quote: item.quote,
      avatar: item.avatar || "",
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateTestimonialAction(target.id, formData)
      : createTestimonialAction(formData);

    startTransition(() => {
      action
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "Saved");
          setOpen(false);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteTestimonialAction(deleteTarget.id)
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "Deleted");
          setDeleteTarget(null);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <ItemManagerShell
      title="Testimonials"
      description="Reusable testimonials for landing and future pages."
      addLabel="Add testimonial"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderTestimonialsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.name}
            meta={item.role || "Testimonial"}
            published={item.published}
            description={item.quote}
            avatar={item.avatar}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {target ? "Edit testimonial" : "Add testimonial"}
            </DialogTitle>
            <DialogDescription>
              Add the voice, role, quote, and optional photo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="rounded-xl">
                  {formData.name ? getInitials(formData.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 space-x-2">
                <Label>Photo</Label>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                  className="hidden"
                  onChange={(event) =>
                    uploadLandingImage(event, (url) =>
                      setFormData((prev) => ({ ...prev, avatar: url }))
                    )
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => avatarRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.avatar ? "Change photo" : "Upload photo"}
                </Button>
              </div>
            </div>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData((prev) => ({ ...prev, name }))}
            />
            <TextField
              label="Role"
              value={formData.role}
              onChange={(role) => setFormData((prev) => ({ ...prev, role }))}
            />
            <TextareaField
              label="Quote"
              value={formData.quote}
              onChange={(quote) => setFormData((prev) => ({ ...prev, quote }))}
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.name}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
