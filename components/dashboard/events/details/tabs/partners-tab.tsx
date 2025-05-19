"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, PlusCircle, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { EmptyState } from "@/components/ui/empty-state"
import { DeleteDialog } from "@/components/delete-dialog"

interface PartnersTabProps {
  partners: any[]
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
}

export function PartnersTab({ partners, onOpenSlideOver, onDeleteItem }: PartnersTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const filteredPartners = partners.filter(
    (partner: any) =>
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!partners || partners.length === 0) {
    return (
      <Card>
        <CardHeader className="flex !flex-row justify-between items-center">
          <div>
            <CardTitle>Event Partners</CardTitle>
            <CardDescription>Manage sponsors and partners</CardDescription>
          </div>
          <Button size="sm" onClick={() => onOpenSlideOver("addPartner")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No partners found"
            description="There are no partners for this event yet. Add your first partner to get started."
            action={
              <Button onClick={() => onOpenSlideOver("addPartner")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex !flex-row justify-between items-center">
        <div>
          <CardTitle>Event Partners</CardTitle>
          <CardDescription>Manage sponsors and partners</CardDescription>
        </div>
        <Button size="sm" onClick={() => onOpenSlideOver("addPartner")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300"
            />
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No partners match your search criteria</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Partner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner: any) => (
                  <TableRow key={partner.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-20 relative">
                          <Image
                            src={partner.logo || "/placeholder.svg"}
                            alt={partner.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="font-medium">{partner.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{partner.type || "Not specified"}</TableCell>
                    <TableCell>
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {partner.website.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">No website</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenSlideOver("editPartner", partner)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <>
                          <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                          <DeleteDialog
                            open={open}
                            onOpenChange={setOpen}
                            Name={partner.name}
                            onConfirm={() => onDeleteItem("partner", partner.id)}
                          />
                        </>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
