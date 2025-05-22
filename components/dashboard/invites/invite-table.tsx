"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Edit, Trash } from "lucide-react"

interface InviteTableProps {
  invites: any[]
  activeType: string
  searchTerm: string
  setSearchTerm: (term: string) => void
  onView: (invite: any) => void
  onEdit: (invite: any) => void
  onDelete: (invite: any) => void
}

export function InviteTable({
  invites,
  activeType,
  searchTerm,
  setSearchTerm,
  onView,
  onEdit,
  onDelete,
}: InviteTableProps) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-4">
        <CardTitle>
          {activeType === "all" ? "All Invites" : `${activeType.charAt(0).toUpperCase() + activeType.slice(1)}`}
        </CardTitle>
        <CardDescription>
          {activeType === "all" ? "Manage your event invitations" : `Manage invitations for ${activeType}s`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center mb-4 md:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300"
            />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Domain</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Country</TableHead>
                <TableHead className="whitespace-nowrap hidden lg:table-cell">Event</TableHead>
                {activeType === "all" && <TableHead className="whitespace-nowrap hidden md:table-cell">Type</TableHead>}
                <TableHead className="whitespace-nowrap">Status</TableHead>
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
                    <TableCell className="font-medium whitespace-nowrap">{invite.name}</TableCell>
                    <TableCell className="whitespace-nowrap truncate max-w-[150px]">{invite.email}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{invite.domain}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{invite.country?.name}</TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell truncate max-w-[150px]">
                      {invite.event?.title}
                    </TableCell>
                    {activeType === "all" && (
                      <TableCell className="whitespace-nowrap hidden md:table-cell capitalize">
                        {invite.type || "guest"}
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap">
                      <Badge
                        className={
                          invite.status === "confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : invite.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {invite.status?.charAt(0).toUpperCase() + invite.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(invite)}
                          className="text-gray-500 hover:text-primary h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(invite)}
                          className="text-gray-500 hover:text-primary h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(invite)}
                          className="text-gray-500 hover:text-red-500 h-8 w-8"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
