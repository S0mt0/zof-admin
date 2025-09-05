"use client";

import { useReadEvents } from "@/lib/hooks";
import { EventFilters } from "./event-filters";
import { EventTable } from "./event-table";
import EventEmptyState from "./event-empty-state";
import { AlertDialog } from "@/components/alert-dialog";

export function EventPage({ data, pagination, searchParams }: EventPageProps) {
  const {
    selectedEvents,
    allCurrentSelected,
    isPending,
    someCurrentSelected,
    actionType,
    targetId,
    openDialog,
    handleBulkDelete,
    handleDeleteEvent,
    handleEditEvent,
    handleSelectAll,
    handleSelectEvent,
    handleViewEvent,
    setActionType,
    setTargetId,
    toggleDialog,
  } = useReadEvents(data);

  const dialogMessage =
    actionType === "bulk"
      ? `Do you really want to delete ${selectedEvents.length} event post(s)?`
      : "Are you sure you want to delete this event post?";

  if (data.length === 0) {
    return (
      <div>
        <EventFilters
          searchParams={searchParams}
          selectedCount={selectedEvents.length}
          onBulkDelete={() => {}} // Note that this won't be called since there are zero selected items to be deleted
          isPending={isPending}
        />
        <EventEmptyState />
      </div>
    );
  }

  return (
    <div>
      <EventFilters
        searchParams={searchParams}
        selectedCount={selectedEvents.length}
        onBulkDelete={() => {
          setActionType("bulk");
          toggleDialog();
        }}
        isPending={isPending}
      />

      <EventTable
        data={data}
        selectedEvents={selectedEvents}
        onSelectEvent={handleSelectEvent}
        onSelectAll={handleSelectAll}
        onViewEvent={handleViewEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={(id) => {
          setActionType("single");
          setTargetId(id);
          toggleDialog();
        }}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
        pagination={pagination}
        searchParams={searchParams}
        isPending={isPending}
      />

      <AlertDialog
        isOpen={openDialog}
        onCancel={toggleDialog}
        onOk={() => {
          if (actionType === "bulk") return handleBulkDelete();
          if (actionType === "single" && targetId)
            return handleDeleteEvent(targetId);
        }}
        message={dialogMessage}
        isPending={isPending}
      />
    </div>
  );
}
