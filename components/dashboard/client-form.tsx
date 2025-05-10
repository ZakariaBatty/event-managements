/* eslint-disable react-hooks/exhaustive-deps */

"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload } from "lucide-react"
import Image from "next/image"

interface ClientFormProps {
  client?: any
  mode: "create" | "edit" | "view"
  onSubmit: (formData: FormData) => void | Promise<void>
  onCancel: () => void
}

export function ClientForm({ client, mode, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    type: "exhibitor",
    status: "active",
    address: "",
    city: "",
    country: "",
    website: "",
    notes: "",
    logo: "",
    invoices: [],
    events: [],
  })

  useEffect(() => {
    if (client && (mode === "edit" || mode === "view")) {
      setFormData({
        ...formData,
        ...client,
      })
    }
  }, [client, mode])

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

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? "active" : "inactive",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the client
    console.log("Form data to save:", formData)
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formDataToSubmit.append(`${key}[${index}]`, item);
        });
      } else {
        formDataToSubmit.append(key, value as string);
      }
    });
    onSubmit(formDataToSubmit);
  }

  const isReadOnly = mode === "view"

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-lg bg-gray-200 overflow-hidden flex items-center justify-center">
              {formData.logo ? (
                <Image
                  src={formData.logo || "/placeholder.svg"}
                  alt={formData.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-400 text-xl font-bold">Logo</span>
              )}
            </div>
            {!isReadOnly && (
              <Button type="button" variant="outline" className="h-10">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Person</Label>
            <Input
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact person name"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Client Type</Label>
              <Select
                disabled={isReadOnly}
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="exhibitor">Exhibitor</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-8">
              <Label htmlFor="status">Active Status</Label>
              <Switch
                id="status"
                checked={formData.status === "active"}
                onCheckedChange={handleStatusChange}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter company website"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Participation</h3>
            {formData.events && formData.events.length > 0 ? (
              <div className="space-y-2">
                {formData.events.map((event: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-500">
                      {event.date} • {event.role}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No event participation history</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invoice History</h3>
            {formData.invoices && formData.invoices.length > 0 ? (
              <div className="space-y-2">
                {formData.invoices.map((invoice: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">{invoice.id}</p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">
                        {invoice.date} • {invoice.amount}
                      </p>
                      <Badge
                        className={
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No invoice history</p>
            )}
          </div>
        </TabsContent>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button type="submit" className="bg-primary hover:bg-primary-light">
              {mode === "create" ? "Create Client" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Tabs>
  )
}
