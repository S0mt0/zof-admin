"use client";

import { useState, useTransition } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createLandingStatAction,
  deleteLandingStatAction,
  updateLandingStatAction,
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

const emptyForm = {
  value: "",
  title: "",
  order: 0,
  published: true,
};

export function StatsManager({ stats }: { stats: LandingStat[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingStat | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LandingStat | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyForm);
    setOpen(true);
  };

  const openEdit = (stat: LandingStat) => {
    setTarget(stat);
    setFormData({
      value: stat.value,
      title: stat.title,
      order: stat.order,
      published: stat.published,
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
      deleteLandingStatAction(deleteTarget.id)
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
          <CardTitle>Stats</CardTitle>
          <CardDescription>
            Manage stat number and title for the landing page.
          </CardDescription>
        </div>
        <Button onClick={openCreate} disabled={isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stat
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.length === 0 ? (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-4">
            No stats yet.
          </div>
        ) : (
          stats.map((stat) => (
            <Card key={stat.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-3xl text-emerald-700">
                      {stat.value}
                    </CardTitle>
                    <CardDescription>{stat.title}</CardDescription>
                  </div>
                  <Badge variant={stat.published ? "default" : "secondary"}>
                    {stat.published ? "Published" : "Hidden"}
                  </Badge>
                </div>
              </CardHeader>
              <CardFooter className="flex items-center justify-between border-t px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Order {stat.order}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(stat)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(stat)}
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
            <DialogTitle>{target ? "Edit stat" : "Add stat"}</DialogTitle>
            <DialogDescription>
              Example: value "50+", title "Communities Supported".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Stat Number</Label>
                <Input
                  value={formData.value}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, value: e.target.value }))
                  }
                  placeholder="50+"
                />
              </div>
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Communities Supported"
                />
              </div>
            </div>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : target ? "Update Stat" : "Add Stat"}
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
    </Card>
  );
}
