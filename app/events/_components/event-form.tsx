"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ChevronDown, Save, Upload, Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import RichTextEditor from "@/components/lexical-editor/editor";
import { EventFormSchema } from "@/lib/schemas";
import { createEventAction, updateEventAction } from "@/lib/actions/events";
import { handleFileUpload } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

interface EventFormProps {
  initialData?: IEvent | null;
  mode: "create" | "edit";
  userId: string;
}

export default function EventForm({
  initialData,
  mode,
  userId,
}: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(initialData?.content || "");
  const [tagsInput, setTagsInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const initialValues = useMemo(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      date: initialData?.date
        ? new Date(initialData.date).toISOString().slice(0, 10)
        : "",
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      location: initialData?.location || "",
      maxAttendees: initialData?.maxAttendees || undefined,
      status: (initialData?.status as any) || "draft",
      bannerImage: initialData?.bannerImage || "",
      featured: initialData?.featured || false,
      tags: initialData?.tags || [],
      ticketPrice: initialData?.ticketPrice || undefined,
      registrationRequired: initialData?.registrationRequired || false,
    }),
    [initialData]
  );

  const form = useForm<z.infer<typeof EventFormSchema>>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: initialValues,
  });

  const addTag = () => {
    const tag = tagsInput.trim();
    if (!tag) return;
    const current = form.getValues("tags") || [];
    if (current.includes(tag)) return;
    form.setValue("tags", [...current, tag]);
    setTagsInput("");
  };

  const removeTag = (tag: string) => {
    const current = form.getValues("tags") || [];
    form.setValue(
      "tags",
      current.filter((t) => t !== tag)
    );
  };

  const onBannerClick = () => inputRef.current?.click();

  const onBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      toast.error("Please select only one file");
      e.target.value = "";
      return;
    }
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use jpg, jpeg, png, or gif.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must not be more than 8MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");
    startTransition(() => {
      handleFileUpload(e, "events")
        .then((objectUrl) => {
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }
          form.setValue("bannerImage", objectUrl || initialValues.bannerImage);
          console.log({ objectUrl });
        })
        .catch((err) => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  };

  const onSubmit = (values: z.infer<typeof EventFormSchema>) => {
    console.log("Form values:", values);
    console.log("Content:", content);

    // Validate content
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    const formData = {
      ...values,
      content,
      date: new Date(values.date),
    };

    console.log("Form data to submit:", formData);

    startTransition(() => {
      if (mode === "create") {
        createEventAction(formData, userId)
          .then((res) => {
            console.log("Create response:", res);
            if (res?.error) {
              toast.error(res.error);
              console.error("Create error:", res.error);
            }
            if (res?.success) {
              toast.success(res.success);
              router.push("/events");
            }
          })
          .catch((err) => {
            console.error("Create action error:", err);
            toast.error("Failed to create event");
          });
      } else if (mode === "edit" && initialData?.id) {
        updateEventAction(initialData.id, formData, userId)
          .then((res) => {
            console.log("Update response:", res);
            if (res?.error) {
              toast.error(res.error);
              console.error("Update error:", res.error);
            }
            if (res?.success) {
              toast.success(res.success);
              router.push("/events");
            }
          })
          .catch((err) => {
            console.error("Update action error:", err);
            toast.error("Failed to update event");
          });
      }
    });
  };

  const values = form.watch();
  const arraysEqual = (a: string[] = [], b: string[] = []) =>
    a.length === b.length && a.every((v, i) => v === b[i]);
  const hasChanges =
    values.title !== initialValues.title ||
    values.description !== initialValues.description ||
    content !== initialValues.content ||
    values.date !== initialValues.date ||
    values.startTime !== initialValues.startTime ||
    values.endTime !== initialValues.endTime ||
    values.location !== initialValues.location ||
    values.maxAttendees !== initialValues.maxAttendees ||
    values.status !== initialValues.status ||
    values.bannerImage !== initialValues.bannerImage ||
    values.featured !== initialValues.featured ||
    values.ticketPrice !== initialValues.ticketPrice ||
    values.registrationRequired !== initialValues.registrationRequired ||
    !arraysEqual(values.tags || [], initialValues.tags || []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your event title..."
                          className="text-lg font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of your event..."
                          rows={3}
                          maxLength={300}
                          className={
                            field.value.length > 250 ? "border-amber-300" : ""
                          }
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-muted-foreground">
                          {values.status !== "draft"
                            ? "Required for publishing"
                            : "Optional for drafts"}
                        </span>
                        <span
                          className={`${
                            field.value.length > 250
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {300 - field.value.length} characters remaining
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            min={new Date().toISOString().slice(0, 10)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Attendees</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="e.g., 100"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Event venue or address..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticketPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Price (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 25"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Registration Required</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Banner Image */}
            <Card>
              <CardHeader>
                <CardTitle>Event Banner</CardTitle>
                <CardDescription>
                  Upload a banner image for your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.watch("bannerImage") ? (
                  <div className="relative">
                    <img
                      src={form.watch("bannerImage") || "/placeholder.svg"}
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
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  className="hidden"
                  onChange={onBannerChange}
                  multiple={false}
                  disabled={isPending}
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details & Agenda</CardTitle>
                <CardDescription>
                  Provide detailed information about your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  name="event-content"
                  value={content}
                  onChange={setContent}
                  placeholder="Describe your event in detail..."
                />
                {/* Hidden content field for form validation */}
                <input
                  type="hidden"
                  {...form.register("content")}
                  value={content}
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
                  disabled={isPending || !form.getValues("title").trim()}
                  className="w-full"
                  variant="outline"
                  onClick={() => form.setValue("status", "draft")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Saving..." : "Save Draft"}
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !form.getValues("title").trim() ||
                    !form.getValues("description").trim() ||
                    form.getValues("description").length < 20 ||
                    !form.getValues("date") ||
                    !form.getValues("startTime") ||
                    !form.getValues("location").trim() ||
                    !content.trim()
                  }
                  className="w-full"
                  onClick={() => form.setValue("status", "upcoming")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Publishing..." : "Publish Event"}
                </Button>

                <Button
                  onClick={() => router.push("/events")}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Button>
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
                    >
                      <span className="capitalize">{form.watch("status")}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem
                      onClick={() => form.setValue("status", "draft")}
                    >
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => form.setValue("status", "upcoming")}
                    >
                      Upcoming
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => form.setValue("status", "cancelled")}
                    >
                      Cancelled
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
                  <Checkbox
                    id="featured"
                    checked={form.watch("featured")}
                    onCheckedChange={(checked) =>
                      form.setValue("featured", checked as boolean)
                    }
                  />
                  <label htmlFor="featured">Mark as featured</label>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button onClick={addTag} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(form.watch("tags") || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
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
    </Form>
  );
}
