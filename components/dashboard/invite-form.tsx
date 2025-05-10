/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InviteFormProps {
  invite?: any
  mode: "create" | "edit" | "view"
  onSubmit: () => void
  onCancel: () => void
}

export function InviteForm({ invite, mode, onSubmit, onCancel }: InviteFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "Industry",
    phone: "",
    country: "",
    event: "",
    status: "pending",
    notes: "",
    organization: "",
    position: "",
    dietary: "",
    arrivalDate: null as Date | null,
    departureDate: null as Date | null,
  })

  useEffect(() => {
    if (invite && (mode === "edit" || mode === "view")) {
      setFormData({
        ...formData,
        ...invite,
        arrivalDate: invite.arrivalDate ? new Date(invite.arrivalDate) : null,
        departureDate: invite.departureDate ? new Date(invite.departureDate) : null,
      })
    }
  }, [invite, mode])

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
      status: checked ? "confirmed" : "pending",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the invite
    console.log("Form data to save:", formData)
    onSubmit()
  }

  const isReadOnly = mode === "view"

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

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
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Select
                disabled={isReadOnly}
                value={formData.domain}
                onValueChange={(value) => handleSelectChange("domain", value)}
              >
                <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Industry">Industry</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="NGO">NGO</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event">Event</Label>
            <Select
              disabled={isReadOnly}
              value={formData.event}
              onValueChange={(value) => handleSelectChange("event", value)}
            >
              <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Salon Halieutis 2025">Salon Halieutis 2025</SelectItem>
                <SelectItem value="Tech Conference 2024">Tech Conference 2024</SelectItem>
                <SelectItem value="Marketing Summit">Marketing Summit</SelectItem>
                <SelectItem value="Business Expo 2024">Business Expo 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status">Confirmed</Label>
            <Switch
              id="status"
              checked={formData.status === "confirmed"}
              onCheckedChange={handleStatusChange}
              disabled={isReadOnly}
            />
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter organization name"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Enter position or title"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Requirements</Label>
            <Input
              id="dietary"
              name="dietary"
              value={formData.dietary}
              onChange={handleChange}
              placeholder="Enter any dietary requirements"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Arrival Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.arrivalDate && "text-muted-foreground",
                      isReadOnly && "bg-gray-50 pointer-events-none",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.arrivalDate ? format(formData.arrivalDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                {!isReadOnly && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.arrivalDate || undefined}
                      onSelect={(date) => setFormData({ ...formData, arrivalDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.departureDate && "text-muted-foreground",
                      isReadOnly && "bg-gray-50 pointer-events-none",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.departureDate ? format(formData.departureDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                {!isReadOnly && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departureDate || undefined}
                      onSelect={(date) => setFormData({ ...formData, departureDate: date || null })}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button type="submit" className="bg-primary hover:bg-primary-light">
              {mode === "create" ? "Send Invite" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Tabs>
  )
}
