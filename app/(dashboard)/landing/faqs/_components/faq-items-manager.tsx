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
  createLandingFaqAction,
  deleteLandingFaqAction,
  reorderLandingFaqsAction,
  updateLandingFaqAction,
} from "@/lib/actions/pages/landing/faqs.actions";
import {
  PublishSwitch,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { SortableList } from "@/components/common/sortable-list";

import { ItemCard } from "@/components/common/item-card";
import { ItemManagerShell } from "@/components/common/item-manager-shell";

const emptyFaqForm = {
  question: "",
  answer: "",
  published: true,
};

export function FaqItemsManager({ items }: { items: FaqItemContent[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<FaqItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItemContent | null>(null);
  const [formData, setFormData] = useState(emptyFaqForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyFaqForm);
    setOpen(true);
  };

  const openEdit = (item: FaqItemContent) => {
    setTarget(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingFaqAction(target.id, formData)
      : createLandingFaqAction(formData);

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
      deleteLandingFaqAction(deleteTarget.id)
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
      title="FAQ items"
      description="Drag questions into the order they should appear."
      addLabel="Add FAQ"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderLandingFaqsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.question}
            meta="Question"
            published={item.published}
            description={item.answer}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              Keep answers clear and useful for visitors.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Question"
              value={formData.question}
              onChange={(question) =>
                setFormData((prev) => ({ ...prev, question }))
              }
            />
            <TextareaField
              label="Answer"
              value={formData.answer}
              onChange={(answer) =>
                setFormData((prev) => ({ ...prev, answer }))
              }
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
              {isPending ? "Saving..." : "Save FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.question}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
