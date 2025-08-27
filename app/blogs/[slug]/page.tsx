import {
  ArrowLeft,
  Tag,
  Calendar,
  Eye,
  Clock,
  Edit,
  Share2,
  Bookmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { getBlogBySlug } from "@/lib/db/repository";
import { capitalize, getInitials } from "@/lib/utils";

export default async function ViewBlogPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const getBlogCached = unstable_cache(getBlogBySlug, [params?.slug], {
    revalidate: 300,
  });
  const blog = await getBlogCached(params.slug);

  if (!blog) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardHeader title="Blog Post Not Found" />
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              The blog post you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link
                href="/blogs"
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Posts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: BlogStatus) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not published";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const displayDate = blog.publishedAt || blog.createdAt;
  const readTime = getReadTime(blog.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blogs" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <article className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 space-y-6">
          {/* Status and Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(blog.status)}>
              {capitalize(blog.status)}
            </Badge>
            {blog.featured && <Badge variant="secondary">Featured</Badge>}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={blog.author?.image}
                  alt={blog.author?.name || "Author"}
                />
                <AvatarFallback>
                  {blog.author?.name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">
                  {blog.author?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(displayDate)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/blogs/${blog.slug}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />
        </header>

        {/* Banner Image */}
        {blog.bannerImage && (
          <div className="mb-8">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={blog.bannerImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                width={1200}
                height={675}
                priority={true}
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {/* Parse and render the blog content */}
          {typeof blog.content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          ) : (
            <div>Content format not supported</div>
          )}
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="mb-8">
            <Separator className="mb-6" />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
