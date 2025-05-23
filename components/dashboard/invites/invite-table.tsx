"use client"

import { useEffect, useState } from "react"
import {
  Card, CardHeader, CardDescription, CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Search, Eye, Edit, Trash, ChevronsLeft, ChevronsRight
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface InviteTableProps {
  invites: any[]
  activeType: string
  searchTerm: string
  setSearchTerm: (term: string) => void
  onView: (invite: any) => void
  onEdit: (invite: any) => void
  onDelete: (invite: any) => void
  meta: {
    page: number
    limit: number
    total: number
    pageCount: number
  }
}

export function InviteTable({
  invites,
  activeType,
  searchTerm,
  setSearchTerm,
  onView,
  onEdit,
  onDelete,
  meta,
}: InviteTableProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10)
  const limitFromUrl = parseInt(searchParams.get("limit") || "10", 10)

  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [pageSize, setPageSize] = useState(limitFromUrl)

  useEffect(() => {
    setCurrentPage(pageFromUrl)
    setPageSize(limitFromUrl)
  }, [pageFromUrl, limitFromUrl])

  const updateUrlParams = (page: number, limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    params.set("limit", limit.toString())
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.pageCount) {
      updateUrlParams(newPage, pageSize)
    }
  }

  const handlePageSizeChange = (newLimit: number) => {
    updateUrlParams(1, newLimit)
  }

  const totalPages = meta?.pageCount || 1

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-4">
        <CardDescription>
          {activeType === "all"
            ? "Manage your event invitations"
            : `Manage invitations for ${activeType}s`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {/* Top bar: Search & limit */}
        <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Rows per page:</span>
            <Select value={String(pageSize)} onValueChange={(value) => handlePageSizeChange(Number(value))}>
              <SelectTrigger className="w-[60px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((num) => (
                  <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border border-gray-200 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Domain</TableHead>
                <TableHead className="hidden md:table-cell">Country</TableHead>
                <TableHead className="hidden lg:table-cell">Event</TableHead>
                {activeType === "all" && <TableHead className="hidden md:table-cell">Type</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={activeType === "all" ? 8 : 7} className="text-center py-6 text-gray-500">
                    No invites found
                  </TableCell>
                </TableRow>
              ) : (
                invites.map((invite) => (
                  <TableRow key={invite.id} className="hover:bg-gray-50">
                    <TableCell className="max-w-[110px]">{invite.name}</TableCell>
                    <TableCell className="truncate max-w-[170px]">{invite.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{invite.domain}</TableCell>
                    <TableCell className="hidden md:table-cell">{invite.country?.name}</TableCell>
                    <TableCell className="hidden lg:table-cell">{invite.events?.title}</TableCell>
                    <TableCell>
                      <Badge className={
                        invite.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                          invite.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                      }>
                        {invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onView(invite)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(invite)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(invite)}><Trash className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
