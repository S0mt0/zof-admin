"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

// Mock data
const blogPosts = [
  {
    id: 1,
    title: "Community Outreach Program Success",
    author: "Admin User",
    status: "published",
    date: "2024-01-15",
    views: 1247,
    excerpt: "Our latest community outreach program has reached over 500 families...",
  },
  {
    id: 2,
    title: "Education Initiative Impact Report",
    author: "Sarah Johnson",
    status: "draft",
    date: "2024-01-12",
    views: 0,
    excerpt: "Comprehensive report on the impact of our education initiatives...",
  },
  {
    id: 3,
    title: "Annual Fundraising Results",
    author: "Admin User",
    status: "published",
    date: "2024-01-10",
    views: 892,
    excerpt: "We're excited to share the results of our annual fundraising campaign...",
  },
  {
    id: 4,
    title: "Volunteer Appreciation Event",
    author: "Mike Chen",
    status: "scheduled",
    date: "2024-01-08",
    views: 234,
    excerpt: "Join us in celebrating our amazing volunteers who make our work possible...",
  },
]

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const handleViewPost = (post: any) => {
    setSelectedPost(post)
    console.log("Viewing post:", post)
    // You can add a modal or navigate to a detailed view here
  }

  const handleEditPost = (post: any) => {
    console.log("Editing post:", post)
    // Navigate to edit page or open edit modal
  }

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      console.log("Deleting post:", postId)
      // Add actual delete logic here
      // For now, we'll just log it
    }
  }

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "draft":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Blog Posts" breadcrumbs={[{ label: "Blog Posts" }]} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Blog Posts</CardTitle>
          <CardDescription>Manage your blog posts, edit content, and track performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground md:hidden">by {post.author}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{post.excerpt}</div>
                    </div>
                  </TableCell>
                  <TableHead className="hidden md:table-cell">{post.author}</TableHead>
                  <TableCell>
                    <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{post.date}</TableCell>
                  <TableCell className="hidden lg:table-cell">{post.views}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => handleViewPost(post)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditPost(post)} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePost(post.id)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
