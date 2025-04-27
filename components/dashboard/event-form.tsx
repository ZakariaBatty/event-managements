"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventFormProps {
  event?: any
  mode: "create" | "edit" | "view"
  onSubmit: () => void
  onCancel: () => void
}

export function EventForm({ event, mode, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    location: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  })

  useEffect(() => {
    if (event && (mode === "edit" || mode === "view")) {
      // Convert string dates to Date objects
      const startDate = event.startDate ? new Date(event.startDate) : null
      const endDate = event.endDate ? new Date(event.endDate) : null

      setFormData({
        name: event.name || "",
        slug: event.slug || "",
        description: event.description || "",
        location: event.location || "",
        startDate,
        endDate,
      })
    }
  }, [event, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "name" && mode !== "view") {
      // Auto-generate slug from name
      setFormData({
        ...formData,
        name: value,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the event
    console.log("Form data to save:", formData)
    onSubmit()
  }

  const isReadOnly = mode === "view"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter event name"
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">yourdomain.com/events/</span>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="event-name"
            required
            readOnly={isReadOnly}
            className={isReadOnly ? "bg-gray-50" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground",
                  isReadOnly && "bg-gray-50 pointer-events-none",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            {!isReadOnly && (
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, startDate: date || null })}
                  initialFocus
                />
              </PopoverContent>
            )}
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground",
                  isReadOnly && "bg-gray-50 pointer-events-none",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            {!isReadOnly && (
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, endDate: date || null })}
                  initialFocus
                />
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Event location"
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Event Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event"
          rows={5}
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button type="submit" className="bg-primary hover:bg-primary-light">
            {mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  )
}
