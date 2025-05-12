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
  onSubmit: (data: { title: string; description: string; location: string; Goals: string; startDate: Date | null; endDate: Date | null; Themes: string[]; organizers: string[] }) => void
  onCancel: () => void
  loading?: boolean
}

export function EventForm({ event, mode, onSubmit, onCancel, loading }: EventFormProps) {
  const [Themes, setThemes] = useState<string[]>([])
  const [organizers, setOrganizers] = useState<string[]>([])


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    Goals: "",
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
        Goals: event.Goals,
      })
      setThemes(event.Themes || [""])
      setOrganizers(event.organizers || [""])
    }
  }, [event, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "title" && mode !== "view") {
      // Auto-generate slug from title
      setFormData({
        ...formData,
        title: value,
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
    onSubmit({ ...formData, Themes, organizers })
  }

  const handleAddThemes = () => setThemes([...Themes, ""])

  const handleThemesChange = (index: number, value: string) => {
    const updated = [...Themes]
    updated[index] = value
    setThemes(updated)
  }

  const handleRemoveThemes = (index: number) => {
    if (Themes.length > 1) {
      setThemes(Themes.filter((_, i) => i !== index))
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
          name="title"
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
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveOrganizers(index)}>
                  Delete
                </Button>
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
          id="Goals"
          name="Goals"
          value={formData.Goals}
          onChange={handleChange}
          placeholder="Event goals"
          rows={3}
          required
          readOnly={isReadOnly}
          className={isReadOnly ? "bg-gray-50" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-right">Themes</Label>
        <div className="space-y-2">
          {Themes.map((theme, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={theme}
                onChange={(e) => handleThemesChange(index, e.target.value)}
                placeholder={`Themes ${index + 1}`}
              />
              {Themes.length > 1 && (
                <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveThemes(index)}>
                  Delete
                </Button>
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
            {loading ? "loading..." : mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  )
}
