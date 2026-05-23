"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SortableItem = { id: string };

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (ids: string[]) => Promise<{ error?: string; success?: string }>;
  renderItem: (item: T, dragHandle: ReactNode) => ReactNode;
}) {
  const router = useRouter();
  const [localItems, setLocalItems] = useState(items);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => setLocalItems(items), [items]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((item) => item.id === active.id);
    const newIndex = localItems.findIndex((item) => item.id === over.id);
    const next = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(next);

    onReorder(next.map((item) => item.id)).then((res) => {
      if (res?.error) return toast.error(res.error);
      toast.success(res?.success || "Order updated");
      router.refresh();
    });
  };

  if (!localItems.length) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        Nothing here yet. Add the first item to bring this section to life.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={localItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid min-w-0 gap-3">
          {localItems.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {(dragHandle) => renderItem(item, dragHandle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      type="button"
      className="flex h-11 w-11 touch-none select-none items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-primary active:cursor-grabbing sm:h-10 sm:w-10"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
      <span className="sr-only">Drag to reorder</span>
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-10 opacity-70" : ""}
    >
      {children(dragHandle)}
    </div>
  );
}
