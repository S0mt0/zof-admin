"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { PublishSwitch, TextField } from "@/components/common/form-controls";
import { SortableList } from "@/components/common/sortable-list";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ItemCard } from "./item-card";
import { ItemManagerShell } from "./item-manager-shell";

const emptyCtaForm = {
  label: "",
  href: "",
  variant: "primary" as CtaVariant,
  published: true,
};

type CtaActionSet<TSection extends string> = {
  create: (
    section: TSection,
    values: typeof emptyCtaForm
  ) => Promise<{ error?: string; success?: string }>;
  update: (
    section: TSection,
    id: string,
    values: typeof emptyCtaForm
  ) => Promise<{ error?: string; success?: string }>;
  delete: (
    section: TSection,
    id: string
  ) => Promise<{ error?: string; success?: string }>;
  reorder: (
    section: TSection,
    ids: string[]
  ) => Promise<{ error?: string; success?: string }>;
};

export function CtaButtonsManager<TSection extends string>({
  section,
  items,
  actions,
}: {
  section: TSection;
  items: CtaButtonContent[];
  actions?: CtaActionSet<TSection>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<CtaButtonContent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CtaButtonContent | null>(
    null
  );
  const [formData, setFormData] = useState(emptyCtaForm);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyCtaForm);
    setOpen(true);
  };

  const openEdit = (item: CtaButtonContent) => {
    setTarget(item);
    setFormData({
      label: item.label,
      href: item.href,
      variant: item.variant,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? actions?.update(section, target.id, formData)
      : actions?.create(section, formData);

    startTransition(() => {
      action
        ?.then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "CTA saved");
          setOpen(false);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;

    startTransition(() => {
      actions
        ?.delete(section, deleteTarget.id)
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "CTA deleted");
          setDeleteTarget(null);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <ItemManagerShell
      title="CTA buttons"
      description="Drag to arrange. Only 2 buttons can be published at once."
      addLabel="Add CTA"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={(ids) => actions?.reorder(section, ids) as any}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.label}
            meta={`${item.variant} button`}
            published={item.published}
            description={item.href}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit CTA" : "Add CTA"}</DialogTitle>
            <DialogDescription>
              Buttons should be short and point visitors to a clear next step.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Button label"
              value={formData.label}
              maxLength={42}
              onChange={(label) => setFormData((prev) => ({ ...prev, label }))}
            />
            <TextField
              label="Button link"
              value={formData.href}
              maxLength={180}
              onChange={(href) => setFormData((prev) => ({ ...prev, href }))}
            />
            <div className="grid content-start gap-2">
              <Label>Button style</Label>
              <Select
                value={formData.variant}
                onValueChange={(variant: CtaVariant) =>
                  setFormData((prev) => ({ ...prev, variant }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {isPending ? "Saving..." : "Save CTA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.label}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
