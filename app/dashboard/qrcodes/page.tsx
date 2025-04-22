"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { PlusCircle, QrCode, FileText, FileType } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { qrCodeData } from "@/data/program"
import Image from "next/image"

export default function QRCodesPage() {
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedQRCode, setSelectedQRCode] = useState<any>(null)

  // Add IDs to QR codes
  const qrCodes = qrCodeData.map((qrCode, index) => ({
    ...qrCode,
    id: `qrcode-${index + 1}`,
  }))

  const columns = [
    {
      key: "qrCodeUrl",
      label: "QR Code",
      render: (value: string) => (
        <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200">
          <Image
            src={value || "/placeholder.svg?height=48&width=48"}
            alt="QR Code"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      isTitle: true,
      render: (value: string, item: any) => (
        <div className="flex flex-col">
          <div className="font-medium text-primary">{value}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
        </div>
      ),
    },
    {
      key: "fileType",
      label: "File Type",
      render: (value: string) => (
        <div className="flex items-center">
          <FileType className="mr-1 h-4 w-4 text-accent" />
          <Badge
            className={
              value === "PDF"
                ? "bg-danger/10 text-danger hover:bg-danger/20"
                : value === "DOC"
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : value === "XLS"
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-warning/10 text-warning hover:bg-warning/20"
            }
          >
            {value}
          </Badge>
        </div>
      ),
    },
    {
      key: "fileSize",
      label: "Size",
      render: (value: string) => (
        <div className="flex items-center">
          <FileText className="mr-1 h-4 w-4 text-success" />
          <span>{value}</span>
        </div>
      ),
    },
  ]

  const handleCreateQRCode = () => {
    setSelectedQRCode(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditQRCode = (qrCode: any) => {
    setSelectedQRCode(qrCode)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewQRCode = (qrCode: any) => {
    setSelectedQRCode(qrCode)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteQRCode = (qrCode: any) => {
    // In a real app, you would call an API to delete the QR code
    console.log("Delete QR code:", qrCode)
    alert(`QR code "${qrCode.title}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the QR code
    setSlideOverOpen(false)
    alert(`QR code would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QR Codes
          </h1>
          <p className="text-gray-500 mt-1">Manage your QR codes and linked documents</p>
        </div>
        <Button onClick={handleCreateQRCode} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          <QrCode className="mr-2 h-4 w-4" />
          Add QR Code
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={qrCodes}
          columns={columns}
          onEdit={handleEditQRCode}
          onDelete={handleDeleteQRCode}
          onView={handleViewQRCode}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="left"
        title={
          slideOverMode === "create" ? "Add New QR Code" : slideOverMode === "edit" ? "Edit QR Code" : "QR Code Details"
        }
      >
        <div className="p-4">
          {/* QR code form would go here */}
          <p>QR code form content</p>
        </div>
      </SlideOver>
    </div>
  )
}
