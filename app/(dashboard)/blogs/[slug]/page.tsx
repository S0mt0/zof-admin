import {
  Tag,
  Calendar,
  Eye,
  Clock,
  Edit,
  MessageCircle,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { format } from "date-fns";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { getBlogBySlug } from "@/lib/db/repository";
import {
  capitalize,
  getInitials,
  getReadTime,
  getStatusColor,
} from "@/lib/utils";
import { BlogNotFound } from "../_components/not-found";
import { ShareButton } from "@/components/share-button";
import { FRONTEND_BASE_URL } from "@/lib/constants";
import { LexicalContentRenderer } from "@/components/lexical-editor/lexical-content-renderer";

export default async function ViewBlogPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const getBlogCached = unstable_cache(getBlogBySlug, [params?.slug], {
    tags: ["blog"],
  });

  const blog = await getBlogCached(params.slug);

  if (!blog) return <BlogNotFound />;

  const displayDate = blog.publishedAt || blog.createdAt;
  const readTime = getReadTime(blog.content);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="View Blog Post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: `${capitalize(blog.title.slice(0, 20))}...` },
        ]}
      />

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
            {capitalize(blog.title)}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Author and Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={blog.author?.image}
                  alt={blog.author?.name || "Author"}
                />
                <AvatarFallback>
                  {getInitials(blog.author?.name) || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-medium">
                  {capitalize(blog.author?.name) || "Zita-Onyeka Foundation"}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(displayDate, "MMMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {blog.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {blog.comments.length.toLocaleString()} comments
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
              <ShareButton
                title={`Read: "${capitalize(blog.title)}" by ${capitalize(
                  blog.author?.name || "Zita-Onyeka Foundation"
                )}`}
                url={`${FRONTEND_BASE_URL}/blogs/${blog.slug}`}
              />
            </div>
          </div>

          <Separator />
        </header>

        {/* Banner Image */}
        {blog.bannerImage && (
          <div className="mb-8">
            <div className="w-full h-auto rounded overflow-hidden bg-muted">
              <Image
                src={blog.bannerImage}
                alt={blog.title}
                className="w-full h-full object-cover object-center"
                width={1200}
                height={675}
                priority={true}
              />
            </div>
          </div>
        )}

        {/* Blog Content */}
        <LexicalContentRenderer content={blog.content} />

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="my-8">
            <Separator className="mb-6" />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {capitalize(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        {blog?.comments.length > 0 && (
          <div className="mb-8">
            <Separator className="mb-6" />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Comments
              </h3>

              <div className="mt-4 space-y-4 text-sm">
                {blog.comments.map((comment, idx) => (
                  <div className="space-y-1" key={idx}>
                    <p className="text-sm">{comment.comment}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        {comment.authorEmail}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {format(comment.createdAt, "MMMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
