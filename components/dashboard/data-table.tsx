"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Edit,
  Search,
  Trash,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps {
  data: any[]
  columns: {
    key: string
    label: string
    render?: (value: any, item: any) => React.ReactNode
    isTitle?: boolean
    titlePath?: string
  }[]
  onEdit: (item: any) => void
  onDelete: (item: any) => void
  onView?: (item: any) => void
  pagination?: {
    total: number
    page: number
    limit: number
    pageCount: number
  }
}

export function DataTable({ data, columns, onEdit, onDelete, onView, pagination }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true

    return columns.some((column) => {
      const value = item[column.key]
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return false
    })
  })

  const handleTitleClick = (item: any, titlePath?: string) => {
    if (titlePath) {
      router.push(titlePath.replace(":id", item.id))
    } else if (onView) {
      onView(item)
    }
  }

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString("page", newPage.toString())}`)
  }

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", newLimit)
    params.set("page", "1") // Reset to first page when changing limit
    router.push(`${pathname}?${params.toString()}`)
  }

  // Calculate pagination values
  const currentPage = pagination?.page || 1
  const totalPages = pagination?.pageCount || 1
  const totalItems = pagination?.total || 0
  const itemsPerPage = pagination?.limit || 10
  const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const showingTo = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-700">
            <Filter className="mr-2 h-4 w-4 text-primary" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-700">
            <Download className="mr-2 h-4 w-4 text-success" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 text-gray-700">
            <RefreshCw className="mr-2 h-4 w-4 text-warning" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {columns.map((column) => (
                  <TableHead key={column.key} className="font-medium text-gray-700">
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, i) => (
                  <TableRow key={item.id || i} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.isTitle ? (
                          <button
                            onClick={() => handleTitleClick(item, column.titlePath)}
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            {column.render ? column.render(item[column.key], item) : item[column.key]}
                            <ArrowUpRight className="ml-1 h-3 w-3" />
                          </button>
                        ) : column.render ? (
                          column.render(item[column.key], item)
                        ) : (
                          item[column.key]
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onView && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onView(item)}
                            className="h-8 w-8 rounded-lg hover:bg-accent/10 hover:text-accent"
                          >
                            <Eye className="h-4 w-4 text-success" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(item)}
                          className="h-8 w-8 rounded-lg hover:bg-danger/10 hover:text-danger"
                        >
                          <Trash className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-gray-500">
            Showing {showingFrom} to {showingTo} of {totalItems} entries
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center mr-4">
              <span className="text-sm text-gray-500 mr-2">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[80px] h-9 rounded-lg">
                  <SelectValue placeholder={itemsPerPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500 ml-2">per page</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(1)}
                disabled={currentPage <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = currentPage
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  // Ensure page numbers are within valid range
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        className="h-9 w-9 rounded-lg"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
