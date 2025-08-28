"use client";
import {
  Save,
  ArrowLeft,
  Upload,
  ChevronDown,
  Calendar,
  MapPin,
  Users,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWriteEvents } from "@/lib/hooks";
import { EditorWrapper } from "@/components/lexical-editor/editor-wrapper";

export function EventForm({
  mode,
  initialData,
}: {
  mode: "create" | "edit";
  initialData?: IEvent | null;
}) {
  const {
    formData,
    hasChanges,
    inputRef,
    isPending,
    formRef,
    submitType,
    addTag,
    handleBackButton,
    handleDateChange,
    handleDetailChange,
    handleEndTimeChange,
    handleExcerptChange,
    handleFeaturedChange,
    handleLocationChange,
    handleMaxAttendeesChange,
    handleNameChange,
    handleNewTagChange,
    handleOrganizerChange,
    handleRegistrationRequiredChange,
    handleStartTimeChange,
    handleStatusChange,
    handleTicketPriceChange,
    onBannerChange,
    onBannerClick,
    onSubmit,
    removeTag,
    setSubmitType,
  } = useWriteEvents({ initialData, mode });

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your event title..."
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="text-lg font-medium"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Short Description</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your event..."
                  value={formData.excerpt || ""}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className={
                    formData.excerpt && formData.excerpt.length > 250
                      ? "border-amber-300"
                      : ""
                  }
                  disabled={isPending}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Optional</span>
                  <span
                    className={
                      formData.excerpt && formData.excerpt.length > 250
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }
                  >
                    {300 - (formData.excerpt ? formData.excerpt.length : 0)}{" "}
                    characters remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={
                      formData.date instanceof Date
                        ? formData.date.toISOString().slice(0, 10)
                        : ""
                    }
                    onChange={(e) => handleDateChange(new Date(e.target.value))}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime || ""}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div>
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.maxAttendees || ""}
                    onChange={(e) =>
                      handleMaxAttendeesChange(Number(e.target.value))
                    }
                    disabled={isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="Event venue or address..."
                  value={formData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="ticketPrice">Ticket Price (optional)</Label>
                <Input
                  id="ticketPrice"
                  placeholder="e.g., ₦25 or Free"
                  value={formData.ticketPrice || ""}
                  onChange={(e) => handleTicketPriceChange(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  placeholder="Organizer name or organization..."
                  value={formData.organizer || ""}
                  onChange={(e) => handleOrganizerChange(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>
                Event Banner <span className="text-red-500">*</span>
              </CardTitle>
              <CardDescription>
                Upload a banner image for your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.bannerImage ? (
                <div className="relative">
                  <img
                    src={formData.bannerImage || "/placeholder.svg"}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBannerClick}
                    className="absolute top-2 right-2"
                    disabled={isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              ) : (
                <div
                  onClick={onBannerClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload event banner
                  </p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                className="hidden"
                onChange={onBannerChange}
                multiple={false}
                disabled={isPending}
                hidden
              />
            </CardContent>
          </Card>

          {/* Detailed Content */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details & Agenda</CardTitle>
              <CardDescription>
                Provide detailed information about your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditorWrapper
                value={formData.detail || ""}
                onChange={handleDetailChange}
                disabled={isPending}
                placeholder="Describe your event in detail..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="submit"
                disabled={isPending || !hasChanges || !formData.name.trim()}
                className="w-full"
                variant="outline"
                onClick={() => setSubmitType("draft")}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending && submitType === "draft"
                  ? "Saving..."
                  : "Save Draft"}
              </Button>

              <Button
                type="submit"
                disabled={
                  isPending ||
                  !hasChanges ||
                  !formData.name.trim() ||
                  !formData.date ||
                  !formData.startTime ||
                  !formData.location.trim() ||
                  !formData.detail?.trim()
                }
                className="w-full"
                onClick={() => setSubmitType("upcoming")}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending && submitType === "upcoming"
                  ? "Publishing..."
                  : "Publish Event"}
              </Button>

              <Button
                type="button"
                onClick={handleBackButton}
                variant="ghost"
                className="w-full"
                disabled={isPending}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>

          {/* Event Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                <span>
                  {formData.date instanceof Date
                    ? formData.date.toISOString().slice(0, 10)
                    : "Date not set"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span>
                  {formData.startTime || "Time not set"}
                  {formData.endTime && ` - ${formData.endTime}`}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                <span>{formData.location || "Location not set"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                <span>Max {formData.maxAttendees || "∞"} attendees</span>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={isPending}
                  >
                    <span className="capitalize">{formData.status}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleStatusChange("draft")}>
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("upcoming")}
                  >
                    Upcoming
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("cancelled")}
                  >
                    Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("completed")}
                  >
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Featured */}
          <Card>
            <CardHeader>
              <CardTitle>Featured</CardTitle>
              <CardDescription>
                Featured events will be displayed on the main website landing
                page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleFeaturedChange(e.target.checked)}
                  disabled={isPending}
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as featured
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Registration Required */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  checked={formData.registrationRequired}
                  onChange={(e) =>
                    handleRegistrationRequiredChange(e.target.checked)
                  }
                  disabled={isPending}
                />
                <label
                  htmlFor="registrationRequired"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Require registration for this event
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help categorize your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag..."
                  value={formData.newTag}
                  onChange={(e) => handleNewTagChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  disabled={isPending}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
