"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AlertDialog } from "@/components/common/alert-dialog";
import { PublishSwitch, TextField } from "@/components/common/form-controls";
import { ItemCard } from "@/components/common/item-card";
import { ItemManagerShell } from "@/components/common/item-manager-shell";
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
import {
  createAboutTrustPointAction,
  deleteAboutTrustPointAction,
  reorderAboutTrustPointsAction,
  updateAboutTrustPointAction,
} from "@/lib/actions/pages/about";

const MAX_PUBLISHED_TRUST_POINTS = 4;

const emptyTrustPointForm = {
  point: "",
  published: true,
};

export function AboutTrustPointsManager({
  items,
}: {
  items: AboutPageTrustPoint[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<AboutPageTrustPoint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AboutPageTrustPoint | null>(
    null
  );
  const [formData, setFormData] = useState(emptyTrustPointForm);
  const [isPending, startTransition] = useTransition();

  const publishedCount = items.filter((item) => item.published).length;

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyTrustPointForm);
    setOpen(true);
  };

  const openEdit = (item: AboutPageTrustPoint) => {
    setTarget(item);
    setFormData({
      point: item.point,
      published: item.published,
    });
    setOpen(true);
  };

  const normalizeFormData = () => {
    const wouldAddPublished =
      formData.published && (!target || !target.published);

    return {
      ...formData,
      published:
        wouldAddPublished && publishedCount >= MAX_PUBLISHED_TRUST_POINTS
          ? false
          : formData.published,
    };
  };

  const onSubmit = () => {
    const values = normalizeFormData();
    const action = target
      ? updateAboutTrustPointAction(target.id, values)
      : createAboutTrustPointAction(values);

    startTransition(() => {
      action
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "Trust point saved");
          setOpen(false);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;

    startTransition(() => {
      deleteAboutTrustPointAction(deleteTarget.id)
        .then((res) => {
          if (res?.error) return toast.error(res.error);
          toast.success(res?.success || "Trust point deleted");
          setDeleteTarget(null);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <ItemManagerShell
      title="Trust points"
      description="Drag to arrange. Only 4 trust points can be published at once."
      addLabel="Add point"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderAboutTrustPointsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.point}
            meta={`Position ${item.order + 1}`}
            published={item.published}
            description={item.published ? "Visible on the page" : "Draft"}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {target ? "Edit trust point" : "Add trust point"}
            </DialogTitle>
            <DialogDescription>
              Keep each point short enough to scan at a glance.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Trust point"
              value={formData.point}
              maxLength={48}
              onChange={(point) => setFormData((prev) => ({ ...prev, point }))}
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
            {formData.published &&
            (!target || !target.published) &&
            publishedCount >= MAX_PUBLISHED_TRUST_POINTS ? (
              <p className="text-xs text-muted-foreground">
                This will be saved as a draft because 4 trust points are already
                published.
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save point"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.point}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
