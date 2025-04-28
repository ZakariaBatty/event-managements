"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Edit, PlusCircle, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { EmptyState } from "@/components/ui/empty-state"

interface QRCodesTabProps {
  qrCodes: any[]
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
}

export function QRCodesTab({ qrCodes, onOpenSlideOver, onDeleteItem }: QRCodesTabProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQRCodes = qrCodes.filter(
    (qrCode: any) =>
      qrCode.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qrCode.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!qrCodes || qrCodes.length === 0) {
    return (
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>QR Codes</CardTitle>
            <CardDescription>Manage QR codes for the event</CardDescription>
          </div>
          <Button size="sm" onClick={() => onOpenSlideOver("addQRCode")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add QR Code
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No QR codes found"
            description="There are no QR codes for this event yet. Add your first QR code to get started."
            action={
              <Button onClick={() => onOpenSlideOver("addQRCode")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add QR Code
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>QR Codes</CardTitle>
          <CardDescription>Manage QR codes for the event</CardDescription>
        </div>
        <Button size="sm" onClick={() => onOpenSlideOver("addQRCode")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add QR Code
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300"
            />
          </div>
        </div>

        {filteredQRCodes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No QR codes match your search criteria</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>QR Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>File Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQRCodes.map((qrCode: any) => (
                  <TableRow key={qrCode.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="h-12 w-12 relative">
                        <Image
                          src={qrCode.qrCodeUrl || "/placeholder.svg"}
                          alt={qrCode.title || "QR Code"}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{qrCode.title || "Untitled"}</TableCell>
                    <TableCell>{qrCode.description || "No description"}</TableCell>
                    <TableCell>
                      {qrCode.fileType ? (
                        <>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {qrCode.fileType}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">{qrCode.fileSize || "Unknown size"}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">No file information</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenSlideOver("editQRCode", qrCode)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => onDeleteItem("qrCode", qrCode.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
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
