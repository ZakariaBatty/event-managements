/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import Image from "next/image"

interface PartnerFormProps {
  partner?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function PartnerForm({ partner, mode, onSubmit, onCancel }: PartnerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    type: "Organization",
    website: "",
  })

  const partnerTypes = ["Government", "Organization", "International", "Corporate", "Academic", "Media", "Sponsor"]

  useEffect(() => {
    if (partner && mode === "edit") {
      setFormData({
        ...formData,
        name: partner.name || "",
        logo: partner.logo || "",
        type: partner.type || "Organization",
        website: partner.website || "",
      })
    }
  }, [partner, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-20 w-40 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          {formData.logo ? (
            <Image
              src={formData.logo || "/placeholder.svg"}
              alt={formData.name}
              width={160}
              height={80}
              className="object-contain"
            />
          ) : (
            <span className="text-gray-400 text-xl font-bold">Logo</span>
          )}
        </div>
        <Button type="button" variant="outline" className="h-10">
          <Upload className="mr-2 h-4 w-4" />
          Upload Logo
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Partner Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter partner name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Partner Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {partnerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://..."
          type="url"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          {mode === "create" ? "Add Partner" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
