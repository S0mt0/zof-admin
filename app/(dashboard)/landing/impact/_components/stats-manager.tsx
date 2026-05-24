"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createLandingStatAction,
  deleteLandingStatAction,
  reorderLandingStatsAction,
  updateLandingStatAction,
} from "@/lib/actions/pages/landing/stats.actions";
import { PublishSwitch, TextField } from "@/components/common/form-controls";
import { SortableList } from "@/components/common/sortable-list";

import { ItemCard } from "@/components/common/item-card";
import { ItemManagerShell } from "@/components/common/item-manager-shell";

const emptyStatForm = {
  value: "",
  title: "",
  published: true,
};

export function StatsManager({ items }: { items: LandingStatItemContent[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingStatItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<LandingStatItemContent | null>(null);
  const [formData, setFormData] = useState(emptyStatForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyStatForm);
    setOpen(true);
  };

  const openEdit = (item: LandingStatItemContent) => {
    setTarget(item);
    setFormData({
      value: item.value,
      title: item.title,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingStatAction(target.id, formData)
      : createLandingStatAction(formData);

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
      deleteLandingStatAction(deleteTarget.id)
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
      title="Impact stats"
      description="Drag to arrange. Only 4 stats can be published at once."
      addLabel="Add stat"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderLandingStatsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.value}
            meta={item.title}
            published={item.published}
            description="Impact stat"
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit stat" : "Add stat"}</DialogTitle>
            <DialogDescription>
              Examples: 50+, 2,000+, 100%, Volunteers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Value"
              value={formData.value}
              onChange={(value) => setFormData((prev) => ({ ...prev, value }))}
            />
            <TextField
              label="Title"
              value={formData.title}
              onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
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
              {isPending ? "Saving..." : "Save stat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.title}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
