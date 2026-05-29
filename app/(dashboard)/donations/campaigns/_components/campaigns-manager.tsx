"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { ItemCard } from "@/components/common/item-card";
import { ItemManagerShell } from "@/components/common/item-manager-shell";
import { SortableList } from "@/components/common/sortable-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createDonationCampaignAction,
  deleteDonationCampaignAction,
  reorderDonationCampaignsAction,
  updateDonationCampaignAction,
} from "@/lib/actions/pages/donations";
import { showActionResult } from "@/lib/utils/pages";

const emptyForm = { topic: "", description: "", published: true };

export function CampaignsManager({ campaigns }: { campaigns: DonationCampaign[] }) {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<DonationCampaign | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const save = () => {
    startTransition(() => {
      const action = editing
        ? updateDonationCampaignAction(editing.id, form)
        : createDonationCampaignAction(form);
      action
        .then((res) => {
          showActionResult(editing ? "Campaign updated" : "Campaign created")(res);
          if (!res?.error) reset();
        })
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const remove = (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    startTransition(() => {
      deleteDonationCampaignAction(id)
        .then(showActionResult("Campaign deleted"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{editing ? "Edit campaign" : "New campaign"}</CardTitle>
          <CardDescription>
            Campaigns appear as donation focus areas on the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Topic</Label>
            <Input
              value={form.topic}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, topic: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Topic uniqueness ignores spacing and letter casing.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
            <div>
              <Label>Published</Label>
              <p className="text-xs text-muted-foreground">
                Published campaigns are selectable on the website.
              </p>
            </div>
            <Switch
              checked={form.published}
              onCheckedChange={(published) =>
                setForm((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {isPending
                ? "Saving..."
                : editing
                ? "Save campaign"
                : "Add campaign"}
            </Button>
            {editing ? (
              <Button variant="outline" onClick={reset}>
                Cancel
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <ItemManagerShell
        title="Campaigns"
        description="Drag to arrange the order donors see on the website. Drafts stay hidden."
        addLabel=""
        onAdd={() => undefined}
      >
        <SortableList
          items={campaigns}
          onReorder={reorderDonationCampaignsAction}
          renderItem={(campaign, dragHandle) => (
            <ItemCard
              key={campaign.id}
              dragHandle={dragHandle}
              title={campaign.topic}
              meta={campaign.published ? "Published campaign" : "Draft campaign"}
              description={campaign.description || "No description"}
              published={campaign.published}
              onEdit={() => {
                setEditing(campaign);
                setForm({
                  topic: campaign.topic,
                  description: campaign.description || "",
                  published: campaign.published,
                });
              }}
              onDelete={() => remove(campaign.id)}
            />
          )}
        />
      </ItemManagerShell>
    </div>
  );
}
