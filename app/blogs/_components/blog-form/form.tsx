"use client";
import { ChevronDown, Save, Upload, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TitleInput } from "./title";
import { ExcerptInput } from "./excerpt";
import { TagsInput } from "./tags";
import { EditorWrapper } from "@/components/lexical-editor/editor-wrapper";
import { useWriteBlogs } from "@/lib/hooks";

export default function BlogForm(props: {
  initialData?: Blog | null;
  mode: "create" | "edit";
}) {
  const {
    submitType,
    formData,
    formRef,
    hasChanges,
    inputRef,
    isPending,
    addTag,
    handleContentChange,
    handleExcerptChange,
    handleFeaturedChange,
    handleNewTagChange,
    handleStatusChange,
    handleTitleChange,
    onBannerChange,
    onBannerClick,
    onSubmit,
    removeTag,
    setSubmitType,
    handleBackButton,
  } = useWriteBlogs(props);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Details */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TitleInput
                value={formData.title}
                onChange={handleTitleChange}
                disabled={isPending}
              />

              <ExcerptInput
                value={formData.excerpt || ""}
                onChange={handleExcerptChange}
                status={formData.status}
                disabled={isPending}
              />
            </CardContent>
          </Card>

          {/* Banner Image */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
              <CardDescription>
                Upload a banner image for your blog post (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.bannerImage ? (
                <div className="relative">
                  <img
                    src={formData.bannerImage}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
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
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF, HEIC up to 8MB
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

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your blog post content using the rich text editor (minimum
                100 characters)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditorWrapper
                value={formData.content}
                onChange={handleContentChange}
                disabled={isPending}
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
                disabled={isPending || !hasChanges}
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
                disabled={isPending || !hasChanges}
                className="w-full"
                onClick={() => setSubmitType("published")}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending && submitType === "published"
                  ? "Publishing..."
                  : "Publish"}
              </Button>

              <Button
                type="button"
                onClick={handleBackButton}
                variant="ghost"
                className="w-full"
                disabled={isPending}
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
                    onClick={() => handleStatusChange("published")}
                  >
                    Published
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("scheduled")}
                  >
                    Scheduled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

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
                  onCheckedChange={handleFeaturedChange}
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

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help categorize your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagsInput
                tags={formData.tags}
                newTag={formData.newTag}
                onNewTagChange={handleNewTagChange}
                onAddTag={addTag}
                onRemoveTag={removeTag}
                disabled={isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
