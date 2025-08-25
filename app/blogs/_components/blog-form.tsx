"use client";

import {
  useEffect,
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
import { BlogFormSchema } from "@/lib/schemas";

// Extend BlogFormSchema to include tagsInput
const ExtendedBlogFormSchema = BlogFormSchema.extend({
  tagsInput: z.string().optional(),
});
import { createBlogAction, updateBlogAction } from "@/lib/actions/blogs";
import { generateSlug, handleFileUpload } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

interface BlogFormProps {
  initialData?: Blog | null;
  mode: "create" | "edit";
  userId: string;
}

export default function BlogForm({ initialData, mode, userId }: BlogFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitType, setSubmitType] = useState<"draft" | "published">("draft");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const initialValues = useMemo(
    () => ({
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      status: (initialData?.status as any) || "draft",
      bannerImage: initialData?.bannerImage || "",
      featured: initialData?.featured || false,
      tags: initialData?.tags || [],
      publishedAt: initialData?.publishedAt
        ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
        : "",
      // publishedAt: initialData?.publishedAt || new Date(),
    }),

    [initialData]
  );
  const form = useForm<z.infer<typeof ExtendedBlogFormSchema>>({
    resolver: zodResolver(ExtendedBlogFormSchema),
    defaultValues: initialValues,
  });

  const addTag = () => {
    const tag = (form.getValues("tagsInput") ?? "").trim();
    if (!tag) return;
    const current = form.getValues("tags") || [];
    if (current.includes(tag)) return;
    form.setValue("tags", [...current, tag]);
    form.setValue("tagsInput", "");
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
      handleFileUpload(e, "blogs")
        .then((objectUrl) => {
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }
          form.setValue("bannerImage", objectUrl || initialValues.bannerImage);
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

  const onSubmit = (values: z.infer<typeof BlogFormSchema>) => {
    // Set status based on which button was pressed
    values.status = submitType;

    // Validate content
    if (!values.content.trim()) {
      toast.error("Content is required");
      return;
    }

    const formData = {
      ...values,
      publishedAt: values.status === "published" ? new Date() : null,
      slug: generateSlug(values.title),
    };

    startTransition(() => {
      if (mode === "create") {
        createBlogAction(formData, userId)
          .then((res) => {
            if (res?.error) {
              toast.error(res.error);
            }
            if (res?.success) {
              toast.success(res.success);
              router.push("/blogs");
            }
          })
          .catch(() => {
            toast.error("Failed to create blog");
          });
      } else if (mode === "edit" && initialData?.id) {
        updateBlogAction(initialData.id, formData, userId)
          .then((res) => {
            if (res?.error) {
              toast.error(res.error);
            }
            if (res?.success) {
              toast.success(res.success);
              router.push("/blogs");
            }
          })
          .catch(() => {
            toast.error("Failed to update blog");
          });
      }
    });
  };

  const values = form.watch();
  const arraysEqual = (a: string[] = [], b: string[] = []) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const hasChanges =
    values.title !== initialValues.title ||
    values.excerpt !== initialValues.excerpt ||
    values.content !== initialValues.content ||
    values.status !== initialValues.status ||
    values.bannerImage !== initialValues.bannerImage ||
    values.featured !== initialValues.featured ||
    !arraysEqual(values.tags || [], initialValues.tags || []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Details */}
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your blog post title..."
                          className="text-lg font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of your blog post..."
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
              </CardContent>
            </Card>

            {/* Banner Image */}
            <Card>
              <CardHeader>
                <CardTitle>Banner Image</CardTitle>
                <CardDescription>
                  Upload a banner image for your blog post
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
                      Click to upload banner image
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
                <CardTitle>Content</CardTitle>
                <CardDescription>
                  Write your blog post content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  name="blog-content"
                  value={form.watch("content")}
                  onChange={(val) => form.setValue("content", val)}
                  placeholder="Write your blog content..."
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
                  onClick={() => setSubmitType("draft")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Saving..." : "Save Draft"}
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    !form.getValues("title").trim() ||
                    !form.getValues("excerpt").trim() ||
                    form.getValues("excerpt").length < 20 ||
                    form.watch("content").trim().length < 100
                  }
                  className="w-full"
                  onClick={() => setSubmitType("published")}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isPending ? "Publishing..." : "Publish"}
                </Button>

                <Button
                  onClick={() => router.push("/blogs")}
                  variant="ghost"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Posts
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
                      onClick={() => form.setValue("status", "published")}
                    >
                      Published
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => form.setValue("status", "scheduled")}
                    >
                      Scheduled
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
                  Featured posts will be displayed on the main website landing
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
                    value={form.getValues("tagsInput")}
                    onChange={(e) => form.setValue("tagsInput", e.target.value)}
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
