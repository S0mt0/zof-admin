import { format } from "date-fns";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";

export const TableContent = ({
  blogs,
  selectedBlogs,
  isPending,
  onSelectBlog,
  onViewBlog,
  onEditBlog,
  onDeleteBlog,
}: BlogTableProps) => {
  const getStatusColor = (status: Blog["status"]) => {
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

  return (
    <TableBody>
      {blogs.map((blog) => (
        <TableRow key={blog.id}>
          <TableCell>
            <Checkbox
              checked={selectedBlogs.includes(blog.id)}
              onCheckedChange={() => onSelectBlog(blog.id)}
            />
          </TableCell>
          <TableCell>
            <div>
              <div className="font-medium">{capitalize(blog.title)}</div>
              <div className="text-sm text-muted-foreground md:hidden">
                {blog.featured ? "⭐ Featured" : "Not Featured"}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {blog.excerpt}
              </div>
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {blog.featured ? (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 border-yellow-200"
              >
                ⭐ Featured
              </Badge>
            ) : (
              <span className="text-muted-foreground">Not Featured</span>
            )}
          </TableCell>
          <TableCell>
            <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            {format(blog.createdAt, "yyyy-MM-dd")}
          </TableCell>
          <TableCell className="hidden lg:table-cell">
            {blog.author ? (
              <div>
                <div className="font-medium">{blog.author.name}</div>
                <div className="text-sm text-muted-foreground">
                  {blog.author.email}
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground">Unknown</span>
            )}
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onClick={() => onViewBlog(blog)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onEditBlog(blog)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteBlog(blog.id)}
                  disabled={isPending}
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
  );
};
