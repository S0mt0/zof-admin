"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter } from "lucide-react"
import { useRouter } from "next/navigation"

// Extended mock data for pagination testing
const allBlogPosts = [
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
  {
    id: 5,
    title: "Health Workshop Summary",
    author: "Dr. Emily Rodriguez",
    status: "published",
    date: "2024-01-05",
    views: 567,
    excerpt: "Summary of our recent community health workshop and its outcomes...",
  },
  {
    id: 6,
    title: "Youth Program Launch",
    author: "Sarah Johnson",
    status: "draft",
    date: "2024-01-03",
    views: 0,
    excerpt: "Preparing for the launch of our new youth mentorship program...",
  },
  {
    id: 7,
    title: "Partnership Announcement",
    author: "Admin User",
    status: "published",
    date: "2024-01-01",
    views: 1123,
    excerpt: "Announcing our new partnership with local businesses for community development...",
  },
  {
    id: 8,
    title: "Volunteer Training Guide",
    author: "Mike Chen",
    status: "draft",
    date: "2023-12-28",
    views: 0,
    excerpt: "Comprehensive guide for new volunteers joining our organization...",
  },
  {
    id: 9,
    title: "Monthly Newsletter - December",
    author: "Admin User",
    status: "published",
    date: "2023-12-25",
    views: 789,
    excerpt: "December newsletter highlighting our achievements and upcoming events...",
  },
  {
    id: 10,
    title: "Grant Application Success",
    author: "Sarah Johnson",
    status: "published",
    date: "2023-12-20",
    views: 456,
    excerpt: "Celebrating our successful grant application for education initiatives...",
  },
  {
    id: 11,
    title: "Community Survey Results",
    author: "Dr. Emily Rodriguez",
    status: "draft",
    date: "2023-12-18",
    views: 0,
    excerpt: "Analysis of our recent community needs survey and findings...",
  },
  {
    id: 12,
    title: "Holiday Charity Drive",
    author: "Mike Chen",
    status: "published",
    date: "2023-12-15",
    views: 1567,
    excerpt: "Our annual holiday charity drive exceeded all expectations...",
  },
  {
    id: 13,
    title: "Volunteer Spotlight: Maria Garcia",
    author: "Admin User",
    status: "published",
    date: "2023-12-10",
    views: 345,
    excerpt: "Highlighting the incredible contributions of volunteer Maria Garcia...",
  },
  {
    id: 14,
    title: "Educational Workshop Series",
    author: "Dr. Emily Rodriguez",
    status: "scheduled",
    date: "2023-12-08",
    views: 123,
    excerpt: "Announcing our new series of educational workshops for 2024...",
  },
  {
    id: 15,
    title: "Partnership with Local Schools",
    author: "Sarah Johnson",
    status: "published",
    date: "2023-12-05",
    views: 678,
    excerpt: "Expanding our reach through partnerships with local educational institutions...",
  },
  {
    id: 16,
    title: "Annual Report 2023 Draft",
    author: "Admin User",
    status: "draft",
    date: "2023-12-01",
    views: 0,
    excerpt: "Draft of our comprehensive annual report for 2023...",
  },
  {
    id: 17,
    title: "Thanksgiving Community Dinner",
    author: "Mike Chen",
    status: "published",
    date: "2023-11-28",
    views: 890,
    excerpt: "Recap of our successful Thanksgiving community dinner event...",
  },
  {
    id: 18,
    title: "Mental Health Awareness Campaign",
    author: "Dr. Emily Rodriguez",
    status: "published",
    date: "2023-11-25",
    views: 1234,
    excerpt: "Launching our mental health awareness campaign for the community...",
  },
]

const ITEMS_PER_PAGE = 5

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  // Filter and search logic
  const filteredPosts = allBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handleSelectPost = (postId: number) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const handleSelectAll = () => {
    const currentPostIds = currentPosts.map((post) => post.id)
    const allCurrentSelected = currentPostIds.every((id) => selectedPosts.includes(id))

    if (allCurrentSelected) {
      setSelectedPosts((prev) => prev.filter((id) => !currentPostIds.includes(id)))
    } else {
      setSelectedPosts((prev) => [...new Set([...prev, ...currentPostIds])])
    }
  }

  const handleBulkDelete = () => {
    if (selectedPosts.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedPosts.length} blog post(s)?`)) {
      console.log("Bulk deleting posts:", selectedPosts)
      setSelectedPosts([])
      // Add actual bulk delete logic here
    }
  }

  const handleViewPost = (post: any) => {
    router.push(`/blogs/${post.id}/view`)
  }

  const handleEditPost = (post: any) => {
    router.push(`/blogs/${post.id}/edit`)
  }

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      console.log("Deleting post:", postId)
    }
  }

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

  const allCurrentSelected = currentPosts.length > 0 && currentPosts.every((post) => selectedPosts.includes(post.id))
  const someCurrentSelected = currentPosts.some((post) => selectedPosts.includes(post.id))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Blog Posts" breadcrumbs={[{ label: "Blog Posts" }]} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("scheduled")}>Scheduled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedPosts.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedPosts.length})
            </Button>
          )}
          <Button onClick={() => router.push("/blogs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={allCurrentSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el) => {
                      if (el) el.indeterminate = someCurrentSelected && !allCurrentSelected
                    }}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => handleSelectPost(post.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground md:hidden">by {post.author}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{post.excerpt}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingStart={startIndex + 1}
            showingEnd={Math.min(endIndex, filteredPosts.length)}
            totalItems={filteredPosts.length}
            itemName="posts"
          />
        </CardContent>
      </Card>
    </div>
  )
}
