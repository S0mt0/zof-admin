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
  createLandingCardAction,
  deleteLandingCardAction,
  reorderLandingCardsAction,
  updateLandingCardAction,
} from "@/lib/actions/pages/landing/cards.actions";

import {
  PublishSwitch,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { SortableList } from "@/components/common/sortable-list";

import { ItemCard } from "./item-card";
import { ItemManagerShell } from "./item-manager-shell";

type CardSection = "about" | "values";

const emptyCardForm = {
  subject: "",
  kicker: "",
  description: "",
  published: true,
};

export function CardsManager({
  section,
  title,
  description,
  items,
}: {
  section: CardSection;
  title: string;
  description: string;
  items: SectionCardItemContent[];
}) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<SectionCardItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<SectionCardItemContent | null>(null);
  const [formData, setFormData] = useState(emptyCardForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyCardForm);
    setOpen(true);
  };

  const openEdit = (item: SectionCardItemContent) => {
    setTarget(item);
    setFormData({
      subject: item.subject,
      kicker: item.kicker || "",
      description: item.description,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingCardAction(section, target.id, formData)
      : createLandingCardAction(section, formData);

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
      deleteLandingCardAction(section, deleteTarget.id)
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
      title={title}
      description={description}
      addLabel="Add card"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={(ids) => reorderLandingCardsAction(section, ids)}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.subject}
            meta={item.kicker || "Section card"}
            published={item.published}
            description={item.description}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit card" : "Add card"}</DialogTitle>
            <DialogDescription>
              Keep this short enough to fit inside the frontend card.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Subject"
              value={formData.subject}
              maxLength={32}
              onChange={(subject) =>
                setFormData((prev) => ({ ...prev, subject }))
              }
            />
            <TextField
              label="Kicker"
              value={formData.kicker}
              maxLength={28}
              onChange={(kicker) =>
                setFormData((prev) => ({ ...prev, kicker }))
              }
            />
            <TextareaField
              label="Description"
              value={formData.description}
              maxLength={150}
              onChange={(description) =>
                setFormData((prev) => ({ ...prev, description }))
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
              {isPending ? "Saving..." : "Save card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.subject}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}
