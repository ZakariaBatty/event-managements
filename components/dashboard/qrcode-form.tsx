"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, QrCode } from "lucide-react"
import Image from "next/image"

interface QRCodeFormProps {
  qrCode?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function QRCodeForm({ qrCode, mode, onSubmit, onCancel }: QRCodeFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    qrCodeUrl: "",
    fileType: "PDF",
    fileSize: "",
    file: null as File | null,
  })

  const fileTypes = ["PDF", "DOC", "XLSX", "JPG", "PNG", "ZIP"]

  useEffect(() => {
    if (qrCode && mode === "edit") {
      setFormData({
        ...formData,
        title: qrCode.title || "",
        description: qrCode.description || "",
        qrCodeUrl: qrCode.qrCodeUrl || "",
        fileType: qrCode.fileType || "PDF",
        fileSize: qrCode.fileSize || "",
        file: null,
      })
    }
  }, [qrCode, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Convert file size to readable format
      const size = file.size
      let fileSize = ""
      if (size < 1024) {
        fileSize = `${size} B`
      } else if (size < 1024 * 1024) {
        fileSize = `${(size / 1024).toFixed(1)} KB`
      } else {
        fileSize = `${(size / (1024 * 1024)).toFixed(1)} MB`
      }

      setFormData({
        ...formData,
        file,
        fileSize,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-32 w-32 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          {formData.qrCodeUrl ? (
            <Image
              src={formData.qrCodeUrl || "/placeholder.svg"}
              alt={formData.title}
              width={128}
              height={128}
              className="object-contain"
            />
          ) : (
            <QrCode className="h-16 w-16 text-gray-400" />
          )}
        </div>
        <div className="space-y-2">
          <Button type="button" variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload QR Code
          </Button>
          <p className="text-xs text-gray-500">Or we'll generate one automatically when you upload a file</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter QR code title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter QR code description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fileType">File Type</Label>
          <Select value={formData.fileType} onValueChange={(value) => handleSelectChange("fileType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileSize">File Size</Label>
          <Input
            id="fileSize"
            name="fileSize"
            value={formData.fileSize}
            onChange={handleChange}
            placeholder="e.g. 2.4 MB"
            disabled={!!formData.file}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Upload File</Label>
        <Input id="file" name="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
        <p className="text-xs text-gray-500">Upload the file that will be accessed via this QR code</p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          {mode === "create" ? "Add QR Code" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
