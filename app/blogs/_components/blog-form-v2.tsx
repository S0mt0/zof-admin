"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";
import { ChevronDown, Save, Upload, ArrowLeft } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RichTextEditor from "@/components/lexical-editor/editor";
import { BlogFormSchema } from "@/lib/schemas";

import { createBlogAction, updateBlogAction } from "@/lib/actions/blogs";
import { generateSlug, handleFileUpload } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/heic",
];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export default function BlogForm({ initialData, mode, userId }: BlogFormProps) {
  const blogData: BlogFormData = {
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    status: initialData?.status || "draft",
    bannerImage: initialData?.bannerImage || "",
    featured: initialData?.featured || false,
    tags: initialData?.tags || [],
    slug: initialData?.slug || "",
    publishedAt: initialData?.publishedAt || new Date(),
    newTag: "",
  };

  const [isPending, startTransition] = useTransition();
  const [submitType, setSubmitType] = useState<"draft" | "published">("draft");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<BlogFormData>(blogData);

  useEffect(() => {
    setFormData(blogData);
  }, []);

  const handleInputChange = <K extends keyof BlogFormData>(
    field: K,
    value: BlogFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditorChange = (value: string) =>
    handleInputChange("content", value);

  const addTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
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
      toast.error("Unsupported file type. Use jpg, jpeg, png, heic, or gif.");
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
          toast.success("Upload successful");
          handleInputChange("bannerImage", objectUrl || formData.bannerImage);
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

  const onSubmit = () => {
    const values = BlogFormSchema.safeParse(blogData);

    if (values.success) {
      const payload = values.data;
      // Set status based on which button was pressed
      payload.status = submitType;

      const formData = {
        ...payload,
        publishedAt: payload.status === "published" ? new Date() : null,
        slug: generateSlug(payload.title),
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
              }
            })
            .catch(() => {
              toast.error("Failed to update blog");
            });
        }
      });
    }
  };

  const arraysEqual = (a: string[] = [], b: string[] = []) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const hasChanges =
    formData.title !== blogData.title ||
    formData.excerpt !== blogData.excerpt ||
    formData.content !== blogData.content ||
    formData.status !== blogData.status ||
    formData.bannerImage !== blogData.bannerImage ||
    formData.featured !== blogData.featured ||
    !arraysEqual(formData.tags || [], blogData.tags || []);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Details */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                type="text"
                placeholder="Enter your blog post title..."
                className="text-lg font-medium"
              />

              <div className="space-y-1 w-full">
                <Textarea
                  value={formData.excerpt!}
                  placeholder="Brief description of your blog post..."
                  rows={3}
                  maxLength={300}
                  className={
                    formData.excerpt && formData.excerpt.length > 250
                      ? "border-amber-300"
                      : ""
                  }
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">
                    {formData.status !== "draft"
                      ? "Required for publishing"
                      : "Optional for drafts"}
                  </span>
                  <span
                    className={`${
                      formData.excerpt && formData.excerpt.length > 250
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {300 - (formData?.excerpt?.length as number)} characters
                    remaining
                  </span>
                </div>
              </div>
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
                hidden
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
                value={formData.content}
                onChange={(val) => handleEditorChange(val)}
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
                disabled={isPending || !hasChanges || !formData.title.trim()}
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
                  !formData.title.trim() ||
                  !formData.excerpt?.trim() ||
                  formData.excerpt?.length < 20 ||
                  !hasChanges
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
                  <Button variant="outline" className="w-full justify-between">
                    <span className="capitalize">{formData.status}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    onClick={() => handleInputChange("status", "draft")}
                  >
                    Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("status", "published")}
                  >
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleInputChange("status", "scheduled")}
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
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked as boolean)
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
                  value={formData.newTag}
                  onChange={(e) => handleInputChange("newTag", e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.tags || []).map((tag) => (
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
  );
}
