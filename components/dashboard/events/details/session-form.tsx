/* eslint-disable react-hooks/exhaustive-deps */
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
import { getSpeakersByEventId } from "@/lib/actions/speaker-actions"
import { MultiSelect } from "../../../ui/multi-select"
import { Speaker } from "@/lib/services/types"
import { Spinner } from "../../../ui/spinner"

interface SessionFormProps {
  eventId: string
  session?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SessionForm({ eventId, session, mode, onSubmit, onCancel }: SessionFormProps) {

  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: mode === "edit" ? session.title || "" : "",
    date: mode === "edit" ? (session.date ? new Date(session.date) : null) : null,
    time: {
      start: mode === "edit" ? (session.time?.split(" - ")[0] || "") : "",
      end: mode === "edit" ? (session.time?.split(" - ")[1] || "") : "",
    },
    type: mode === "edit" ? session.type || "MASTER_CLASS" : "MASTER_CLASS",
    description: mode === "edit" ? session.description || "" : "",
    speakers: mode === "edit" ? session.speakers?.map((item: any) => item.id) || [] : [],
    location: mode === "edit" ? session.location || "" : "",
  })

  const sessionTypes = [
    { value: "MASTER_CLASS", label: "Master Class" },
    { value: "SIDE_EVENT", label: "Side Event" },
    { value: "NETWORKING", label: "Networking" },
    { value: "SHOWCASE", label: "Showcase" },
    { value: "ROUNDTABLE", label: "Roundtable" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "KEYNOTE", label: "Keynote" },
    { value: "PANEL", label: "Panel" },
  ]


  useEffect(() => {
    // Fetch speakers for the event
    const getSpeakers = async () => {
      const speakers = await getSpeakersByEventId(eventId)
      setSpeakers(speakers)
    }
    getSpeakers()
  }, [])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value, })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name غتكون "start" أو "end"
    setFormData({
      ...formData,
      time: {
        ...formData.time,
        [name]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formattedTime = `${formData.time.start} - ${formData.time.end}`
      const dataToSend = {
        ...formData,
        time: formattedTime,
      }
      await onSubmit(dataToSend)
    } finally {
      setLoading(false)
    }
  }


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

        <div className="space-y-2 col-span-1">
          <div className="relative flex flex-row gap-4 items-center">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                name="start"
                value={formData.time.start}
                onChange={handleTimeChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                name="end"
                value={formData.time.end}
                onChange={handleTimeChange}
                required
              />
            </div>
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
            {sessionTypes.map((type) => (
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
        <Label htmlFor="speakers">Speakers</Label>
        <div>
          <MultiSelect
            options={speakers.map((speaker) => ({ label: speaker.name, value: speaker.id }))}
            selected={formData.speakers}
            onChange={(selected) => setFormData({ ...formData, speakers: selected })}
            placeholder="Select speakers"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          {loading ? "Saving..." : mode === "create" ? "Add Session" : "Save Changes"}

        </Button>
      </div>
    </form>
  )
}
