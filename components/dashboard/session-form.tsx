"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { programData } from "@/data/program"

interface SessionFormProps {
  session?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SessionForm({ session, mode, onSubmit, onCancel }: SessionFormProps) {

  console.log()

  const [formData, setFormData] = useState({
    title: "",
    date: null as Date | null,
    time: "",
    type: "MASTER_CLASS",
    description: "",
    speakers: [] as string[],
    location: "",
  })

  const sessionTypes = [
    { value: "MASTER_CLASS", label: "Master Class" },
    { value: "SIDE_EVENT", label: "Side Event" },
    { value: "NETWORKING", label: "Networking" },
    { value: "SHOWCASE", label: "Showcase" },
    { value: "ROUNDTABLE", label: "Roundtable" },
  ]

  useEffect(() => {
    if (session && mode === "edit") {
      setFormData({
        ...formData,
        title: session.title || "",
        date: session.date ? new Date(session.date) : null,
        time: session.time || "",
        type: session.type || "MASTER_CLASS",
        description: session.description || "",
        speakers: session.speakers || [],
        location: session.location || "",
      })
    }
  }, [session, mode])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Extract session types from program data
  const getSessionTypesFromData = () => {
    const types = new Set<string>()
    programData.sideEvent.forEach((day) => {
      day.items.forEach((item) => {
        if (item.type) {
          types.add(item.type)
        }
      })
    })
    return Array.from(types).map((type) => ({
      value: type,
      label: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }))
  }

  const sessionTypesFromData = getSessionTypesFromData()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Session Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter session title"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date || undefined}
                onSelect={(date) => setFormData({ ...formData, date: date || null })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g. 14:00 - 16:00"
              className="pl-9"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Session Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {sessionTypesFromData.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter session location"
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
          placeholder="Enter session description"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="speakers">Speakers (comma separated)</Label>
        <Input
          id="speakers"
          name="speakers"
          value={formData.speakers.join(", ")}
          onChange={(e) => {
            const speakersList = e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
            setFormData({ ...formData, speakers: speakersList })
          }}
          placeholder="Enter speaker names separated by commas"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          {mode === "create" ? "Add Session" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
