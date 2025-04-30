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
  onCancel: () => void
}

export function EventForm({ event, mode, onCancel }: EventFormProps) {
  const [themes, setThemes] = useState<string[]>([])
  const [organizers, setOrganizers] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    goals: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  })

  useEffect(() => {
    if (event && (mode === "edit" || mode === "view")) {
      // Convert string dates to Date objects
      const startDate = event.startDate ? new Date(event.startDate) : null
      const endDate = event.endDate ? new Date(event.endDate) : null

      setFormData({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        startDate,
        endDate,
        goals: event.goals
      })
      setThemes(event.themes || [""])
      setOrganizers(event.organizers || [""])
    }
  }, [event, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { title, value } = e.target

    if (title === "title" && mode !== "view") {
      // Auto-generate slug from title
      setFormData({
        ...formData,
        title: value,
      })
    } else {
      setFormData({
        ...formData,
        [title]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the event
    console.log("Form data to save:", formData)
  }

  const handleAddThemes = () => setThemes([...themes, ""])


  const handleThemesChange = (index: number, value: string) => {
    const updated = [...themes]
    updated[index] = value
    setThemes(updated)
  }

  const handleRemoveThemes = (index: number) => {
    if (themes.length > 1) {
      setThemes(themes.filter((_, i) => i !== index))
    }
  }

  const handleAddOrganizers = () => setOrganizers([...organizers, ""])


  const handleOrganizersChange = (index: number, value: string) => {
    const updated = [...organizers]
    updated[index] = value
    setOrganizers(updated)
  }

  const handleRemoveOrganizers = (index: number) => {
    if (organizers.length > 1) {
      setOrganizers(organizers.filter((_, i) => i !== index))
    }
  }

  const isReadOnly = mode === "view"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Name</Label>
        <Input
          id="title"
          title="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
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
          title="location"
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
          title="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event"
          rows={5}
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-right">Organizers</Label>
        <div className="space-y-2">
          {organizers.map((Organizer, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={Organizer}
                onChange={(e) => handleOrganizersChange(index, e.target.value)}
                placeholder={`Organizer ${index + 1}`}
              />
              {organizers.length > 1 && (
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveOrganizers(index)}>Delete</Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={handleAddOrganizers} variant="outline" size="sm">
            + Add Organizers
          </Button>
        </div>
      </div>


      <div className="space-y-2">
        <Label htmlFor="goals">Goals</Label>
        <Textarea
          id="goals"
          title="goals"
          value={formData.goals}
          onChange={handleChange}
          placeholder="Describe your event"
          rows={3}
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>


      <div className="space-y-2">
        <Label className="text-right">Themes</Label>
        <div className="space-y-2">
          {themes.map((theme, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={theme}
                onChange={(e) => handleThemesChange(index, e.target.value)}
                placeholder={`Themes ${index + 1}`}
              />
              {theme.length > 1 && (
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveThemes(index)}>Delete</Button>
              )}
            </div>
          ))}
          <Button type="button" onClick={handleAddThemes} variant="outline" size="sm">
            + Add Themes
          </Button>
        </div>
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
