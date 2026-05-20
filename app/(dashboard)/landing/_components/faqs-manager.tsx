"use client";

import {
  type DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Edit, GripVertical, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createLandingFaqAction,
  deleteLandingFaqAction,
  reorderLandingFaqsAction,
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

const sortFaqs = (items: LandingFaq[]) =>
  [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const moveFaq = (items: LandingFaq[], fromId: string, toId: string) => {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return items;

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export function FaqsManager({ faqs }: { faqs: LandingFaq[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isReordering, startReorderTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingFaq | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingFaq | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [items, setItems] = useState(() => sortFaqs(faqs));
  const itemsRef = useRef(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const orderedFaqs = useMemo(() => sortFaqs(faqs), [faqs]);

  useEffect(() => {
    setItems(orderedFaqs);
    itemsRef.current = orderedFaqs;
  }, [orderedFaqs]);

  const openCreate = () => {
    setTarget(null);
    setFormData({
      ...emptyForm,
      order: items.reduce((max, faq) => Math.max(max, faq.order), -1) + 1,
    });
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

  const persistOrder = (nextItems: LandingFaq[]) => {
    const payload = nextItems.map((faq, index) => ({
      id: faq.id,
      order: index,
    }));

    startReorderTransition(() => {
      reorderLandingFaqsAction(payload)
        .then((res) => {
          if (res?.error) {
            setItems(orderedFaqs);
            return toast.error(res.error);
          }

          if (res?.success) {
            toast.success(res.success);
            router.refresh();
          }
        })
        .catch(() => {
          setItems(orderedFaqs);
          toast.error("Could not update FAQ order");
        });
    });
  };

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    faqId: string
  ) => {
    setDraggedId(faqId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", faqId);
  };

  const handleDragEnter = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    setDropTargetId(targetId);
    setItems((current) => {
      const next = moveFaq(current, draggedId, targetId);
      itemsRef.current = next;
      return next;
    });
  };

  const handleDragEnd = () => {
    if (!draggedId) return;

    setDraggedId(null);
    setDropTargetId(null);
    persistOrder(itemsRef.current);
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
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No FAQs yet.
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-md border border-dashed bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <span>Drag the handle to rearrange questions vertically.</span>
              {isReordering ? <span>Saving order...</span> : null}
            </div>

            {items.map((faq, index) => {
              const isDragging = draggedId === faq.id;
              const isDropTarget = dropTargetId === faq.id && !isDragging;

              return (
                <Card
                  key={faq.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={() => handleDragEnter(faq.id)}
                  className={[
                    "transition-all",
                    isDragging
                      ? "scale-[0.99] opacity-55 ring-2 ring-primary"
                      : "",
                    isDropTarget ? "border-primary bg-primary/5" : "",
                  ].join(" ")}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <button
                          type="button"
                          draggable={!isPending && !isReordering}
                          aria-label={`Drag ${faq.question}`}
                          onDragStart={(event) =>
                            handleDragStart(event, faq.id)
                          }
                          onDragEnd={handleDragEnd}
                          className="mt-0.5 flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isPending || isReordering}
                        >
                          <GripVertical className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                          <CardTitle className="text-base">
                            {faq.question}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {faq.answer}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={faq.published ? "default" : "secondary"}>
                        {faq.published ? "Published" : "Hidden"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      Position {index + 1}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(faq)}
                      >
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
              );
            })}
          </div>
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
            <div className="grid gap-4">
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
