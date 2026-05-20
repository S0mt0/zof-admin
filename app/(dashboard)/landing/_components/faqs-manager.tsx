"use client";

import { useState, useTransition } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createLandingFaqAction,
  deleteLandingFaqAction,
  updateLandingFaqAction,
} from "@/lib/actions/pages";
import { AlertDialog } from "@/components/alert-dialog";
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

const emptyForm = {
  question: "",
  answer: "",
  order: 0,
  published: true,
};

export function FaqsManager({ faqs }: { faqs: LandingFaq[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingFaq | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyForm);
    setOpen(true);
  };

  const openEdit = (faq: LandingFaq) => {
    setTarget(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      published: faq.published,
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
      deleteLandingFaqAction(deleteTarget.id)
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
          <CardTitle>FAQs</CardTitle>
          <CardDescription>Manage landing page questions and answers.</CardDescription>
        </div>
        <Button onClick={openCreate} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {faqs.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No FAQs yet.
          </div>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {faq.answer}
                    </CardDescription>
                  </div>
                  <Badge variant={faq.published ? "default" : "secondary"}>
                    {faq.published ? "Published" : "Hidden"}
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Order {faq.order}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(faq)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(faq)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              Add a question and answer for the public landing page.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Question</Label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, question: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Answer</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, answer: e.target.value }))
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
              {isPending ? "Saving..." : target ? "Update FAQ" : "Add FAQ"}
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
    </Card>
  );
}
