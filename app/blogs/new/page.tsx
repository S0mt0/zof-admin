"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolConstructable } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";

import { DashboardHeader } from "@/components/dashboard-header";
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
import { Save, ArrowLeft, Eye, Upload, ChevronDown } from "lucide-react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const editorRef = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    status: "draft",
    bannerImage: "",
    author: "Admin User",
    tags: [] as string[],
    newTag: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initEditor = async () => {
      if (typeof window !== "undefined" && !editorRef.current) {
        // Load EditorJS and plugins

        const Header = (await import("@editorjs/header"))
          .default as unknown as ToolConstructable;

        const List = (await import("@editorjs/list"))
          .default as unknown as ToolConstructable;

        const Paragraph = (await import("@editorjs/paragraph"))
          .default as unknown as ToolConstructable;

        const Image = (await import("@editorjs/image"))
          .default as unknown as ToolConstructable;

        const Quote = (await import("@editorjs/quote"))
          .default as unknown as ToolConstructable;

        const Code = (await import("@editorjs/code"))
          .default as unknown as ToolConstructable;

        const Delimiter = (await import("@editorjs/delimiter"))
          .default as unknown as ToolConstructable;

        const Table = (await import("@editorjs/table"))
          .default as unknown as ToolConstructable;

        editorRef.current = new EditorJS({
          holder: "editorjs",
          placeholder: "Start writing your blog post content...",
          tools: {
            header: {
              class: Header,
              config: {
                levels: [1, 2, 3],
                Level: 2,
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    // Simulate file upload
                    return new Promise((resolve) => {
                      setTimeout(() => {
                        resolve({
                          success: 1,
                          file: {
                            url: "/placeholder.svg?height=400&width=800",
                          },
                        });
                      }, 1000);
                    });
                  },
                  uploadByUrl: async (url: string) => {
                    return {
                      success: 1,
                      file: { url },
                    };
                  },
                },
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
            },
            code: {
              class: Code,
            },
            delimiter: Delimiter,
            table: {
              class: Table,
              inlineToolbar: true,
            },
          },
          data: {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: "Start writing your amazing blog post here...",
                },
              },
            ],
          },
        });

        setIsEditorReady(true);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
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

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = () => {
    // Simulate image upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In a real app, you'd upload to your server/cloud storage
        setFormData((prev) => ({
          ...prev,
          bannerImage: "/placeholder.svg?height=400&width=800",
        }));
      }
    };
    input.click();
  };

  const handleSave = async (status: string) => {
    if (!editorRef.current) return;

    // Validation for publishing
    if (status === "published") {
      if (!formData.title.trim()) {
        alert("Title is required for publishing");
        return;
      }
      if (!formData.excerpt.trim()) {
        alert("Excerpt is required for publishing");
        return;
      }
      if (formData.excerpt.length < 50) {
        alert("Excerpt must be at least 50 characters for publishing");
        return;
      }
    }

    setIsLoading(true);
    try {
      const editorData = await editorRef.current.save();

      const blogPost = {
        ...formData,
        status,
        content: editorData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Saving blog post:", blogPost);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `Blog post ${
          status === "published" ? "published" : "saved as draft"
        } successfully!`
      );
      router.push("/blogs");
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error saving blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!editorRef.current) return;

    try {
      const editorData = await editorRef.current.save();
      console.log("Preview data:", { ...formData, content: editorData });
      alert("Preview functionality would open in a new tab");
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Blog Post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: "New Post" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your blog post title..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-lg font-medium"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">
                  Excerpt <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief description of your blog post..."
                  value={formData.excerpt}
                  onChange={(e) => {
                    if (e.target.value.length <= 300) {
                      handleInputChange("excerpt", e.target.value);
                    }
                  }}
                  rows={3}
                  maxLength={300}
                  className={
                    formData.excerpt.length > 250 ? "border-amber-300" : ""
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
                      formData.excerpt.length > 250
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {300 - formData.excerpt.length} characters remaining
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
                    onClick={handleImageUpload}
                    className="absolute top-2 right-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              ) : (
                <div
                  onClick={handleImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload banner image
                  </p>
                </div>
              )}
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
              <div
                id="editorjs"
                className="min-h-[400px] prose max-w-none"
                style={{ outline: "none" }}
              />
              {!isEditorReady && (
                <div className="flex items-center justify-center h-32">
                  <div className="text-sm text-gray-500">Loading editor...</div>
                </div>
              )}
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
                onClick={() => handleSave("draft")}
                disabled={isLoading || !formData.title.trim()}
                className="w-full"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Draft"}
              </Button>

              <Button
                onClick={() => handleSave("published")}
                disabled={
                  isLoading ||
                  !formData.title.trim() ||
                  !formData.excerpt.trim() ||
                  formData.excerpt.length < 50
                }
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish"}
              </Button>

              <Button
                onClick={handlePreview}
                disabled={!formData.title.trim()}
                variant="secondary"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
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

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
              />
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
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
