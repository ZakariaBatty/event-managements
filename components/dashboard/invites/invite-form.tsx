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
import { Spinner } from "@/components/ui/spinner"
import { eventsList } from "@/lib/actions/event-actions"
import { getCountriesAction } from "@/lib/actions/country-actions"

interface InviteFormProps {
  invite?: any
  mode: "create" | "edit" | "view"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function InviteForm({ invite, mode, onSubmit, onCancel }: InviteFormProps) {
  console.log("mode", mode)
  const [isLoading, setIsLoading] = useState(false)
  const [countries, setCountries] = useState<any>([])
  const [events, setEvents] = useState<any>([])
  const [isFetched, setIsFetched] = useState(false)

  const [formData, setFormData] = useState({
    name: mode !== "create" ? invite.name || "" : "",
    email: mode !== "create" ? invite.email || "" : "",
    phone: mode !== "create" ? invite.phone || "" : "",
    notes: mode !== "create" ? invite.notes || "" : "",
    domain: mode !== "create" ? invite.domain || "Industry" : "Industry",
    type: mode !== "create" ? invite.type || "INVITE" : "INVITE",
    status: mode !== "create" ? invite.status || "ACCEPTED" : "ACCEPTED",
    eventId: mode !== "create" ? invite.eventId || "" : "",
    countryId: mode !== "create" ? invite.countryId || "" : "",
  })

  useEffect(() => {
    const getData = async () => {
      setIsFetched(true)
      const countries = await getCountriesAction()
      const events = await eventsList()
      setCountries(countries || [])
      setEvents(events || [])
      setIsFetched(false)
    }
    getData()
  }, [])

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
      status: checked ? "ACCEPTED" : "PENDING",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // In a real app, you would call an API to save the invite
    try {
      await onSubmit({ ...formData })
    } catch (error) {
      console.error("Error submitting form:", error)
      // Handle error (e.g., show a notification)
    } finally {
      setIsLoading(false)
    }
  }

  const isReadOnly = mode === "view"

  return (
    <Tabs defaultValue="general" className="w-full">
      {/* <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList> */}

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
              <Select
                disabled={isReadOnly || isFetched}
                value={formData.countryId}
                onValueChange={(value) => handleSelectChange("countryId", value)}
              >
                <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country: any) => (
                    <SelectItem key={country.id} value={country.id}>
                      {isFetched ? "Loading..." : country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              disabled={isReadOnly || isFetched}
              value={formData.eventId}
              onValueChange={(value) => handleSelectChange("eventId", value)}
            >
              <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event: any) => (
                  <SelectItem key={event.id} value={event.id}>
                    {isFetched ? "Loading..." : event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              rows={3}
            />
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

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button type="submit" className="bg-primary hover:bg-primary-light">
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
              {isLoading ? "Loading..." : mode === "create" ? "Send Invite" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Tabs>
  )
}
