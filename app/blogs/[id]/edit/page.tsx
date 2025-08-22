"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Save, ArrowLeft, Upload, ChevronDown, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/lexical-editor/editor";

// Mock data - in real app, this would come from API
const mockBlogPosts = [
  {
    id: 1,
    title: "Community Outreach Program Success",
    author: "Admin User",
    status: "published",
    date: "2024-01-15",
    views: 1247,
    excerpt:
      "Our latest community outreach program has reached over 500 families in need, providing essential resources and support to strengthen our community bonds.",
    bannerImage: "/placeholder.svg?height=400&width=800",
    tags: ["community", "outreach", "success"],
    content: {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "Our community outreach program has been a tremendous success, reaching over 500 families in the past quarter. This initiative has strengthened community bonds and provided essential resources to those in need.",
          },
        },
      ],
    },
  },
  {
    id: 2,
    title: "Education Initiative Impact Report",
    author: "Sarah Johnson",
    status: "draft",
    date: "2024-01-12",
    views: 0,
    excerpt:
      "Comprehensive report on the impact of our education initiatives across local schools and communities, showing significant improvements in student outcomes.",
    bannerImage: "",
    tags: ["education", "report", "impact"],
    content: {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: "This comprehensive report details the significant impact our education initiatives have had on local schools and communities over the past year.",
          },
        },
      ],
    },
  },
];

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const editorRef = useRef<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [content, setContent] = useState<string>("");

  // Find the blog post by ID
  const blogPost = mockBlogPosts.find(
    (post) => post.id === Number.parseInt(params.id as string)
  );

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    status: "draft",
    bannerImage: "",
    author: "Admin User",
    tags: [] as string[],
    newTag: "",
  });

  useEffect(() => {
    // Simulate loading blog post data
    if (blogPost) {
      setFormData({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        status: blogPost.status,
        bannerImage: blogPost.bannerImage,
        author: blogPost.author,
        tags: blogPost.tags,
        newTag: "",
      });
      setIsLoadingPost(false);
      try {
        const html = blogPost.content?.blocks
          ?.map((b: any) =>
            b.type === "paragraph" ? `<p>${b.data?.text ?? ""}</p>` : ""
          )
          .join("")
          .trim();
        setContent(html || "");
      } catch {
        setContent("");
      }
    } else {
      // Blog post not found
      alert("Blog post not found");
      router.push("/blogs");
    }
  }, [blogPost, router]);

  // Removed EditorJS init; using Lexical

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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          bannerImage: "/placeholder.svg?height=400&width=800",
        }));
      }
    };
    input.click();
  };

  const handleSave = async (status: string) => {
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
      const updatedBlogPost = {
        ...formData,
        status,
        content,
        updatedAt: new Date().toISOString(),
      };

      console.log("Updating blog post:", updatedBlogPost);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        `Blog post ${
          status === "published" ? "published" : "updated"
        } successfully!`
      );
      router.push("/blogs");
    } catch (error) {
      console.error("Error updating blog post:", error);
      alert("Error updating blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        console.log("Deleting blog post:", params.id);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Blog post deleted successfully!");
        router.push("/blogs");
      } catch (error) {
        console.error("Error deleting blog post:", error);
        alert("Error deleting blog post. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoadingPost) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardHeader title="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading blog post...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${formData.title}`}
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: "Edit Post" },
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
                Edit your blog post content using the rich text editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                name="blog-edit-content"
                value={content}
                onChange={setContent}
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
                onClick={() => handleSave("draft")}
                disabled={isLoading || !formData.title.trim()}
                className="w-full"
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
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
                {isLoading ? "Publishing..." : "Update & Publish"}
              </Button>

              <Button
                onClick={() => router.push("/blogs")}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Posts
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isLoading}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
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
