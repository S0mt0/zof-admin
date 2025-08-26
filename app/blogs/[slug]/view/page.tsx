"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, Calendar, User, Tag } from "lucide-react";

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
      "Our latest community outreach program has reached over 500 families in need, providing essential resources and support.",
    content: `
      <h2>A Remarkable Achievement</h2>
      <p>We are thrilled to announce the outstanding success of our latest community outreach program. Over the past three months, our dedicated team of volunteers and staff members have worked tirelessly to reach families in need throughout our community.</p>
      
      <h3>Key Achievements</h3>
      <ul>
        <li>Reached over 500 families with essential resources</li>
        <li>Distributed 2,000 food packages</li>
        <li>Provided educational materials to 300 children</li>
        <li>Connected 150 families with healthcare services</li>
      </ul>
      
      <p>This program has been a testament to the power of community collaboration and the impact we can make when we work together towards a common goal.</p>
      
      <h3>Looking Forward</h3>
      <p>Building on this success, we are already planning our next outreach initiative, which will focus on educational support and job training programs. We believe that by addressing the root causes of poverty and inequality, we can create lasting change in our community.</p>
    `,
    tags: ["Community", "Outreach", "Success Story"],
    bannerImage: "/placeholder.svg?height=400&width=800",
    readTime: "5 min read",
  },
];

export default function ViewBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number.parseInt(params.slug as string);

  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load blog post data
    const foundPost = mockBlogPosts.find((p) => p.id === postId);
    if (foundPost) {
      setPost(foundPost);
    }
    setIsLoading(false);
  }, [postId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <DashboardHeader title="Blog Post Not Found" />
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">
              The blog post you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/blogs")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="View Blog Post"
        breadcrumbs={[
          { label: "Blog Posts", href: "/blogs" },
          { label: post.title },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="space-y-4">
              {post.bannerImage && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={post.bannerImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getStatusColor(post.status)}>
                    {post.status}
                  </Badge>
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <CardTitle className="text-2xl lg:text-3xl">
                  {post.title}
                </CardTitle>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views} views
                  </div>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose prose-gray max-w-none">
                <div className="text-lg text-gray-600 mb-6 font-medium">
                  {post.excerpt}
                </div>

                <div
                  className="space-y-4"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
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
                onClick={() => router.push(`/blogs/${post.id}/edit`)}
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Button>

              <Button
                onClick={() => router.push("/blogs")}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Posts
              </Button>
            </CardContent>
          </Card>

          {/* Post Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Post Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Views:</span>
                <span className="font-medium">{post.views}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge
                  className={getStatusColor(post.status)}
                  variant="outline"
                >
                  {post.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Published:</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Read Time:</span>
                <span>{post.readTime}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-muted-foreground">
                    Content Creator
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
