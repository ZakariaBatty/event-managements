"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import Image from "next/image"
import { speakersData } from "@/data/program"

interface SpeakerFormProps {
  speaker?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SpeakerForm({ speaker, mode, onSubmit, onCancel }: SpeakerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    bio: "",
    title: "",
    avatar: "",
    sessions: [] as string[],
  })

  useEffect(() => {
    if (speaker && mode === "edit") {
      setFormData({
        ...formData,
        name: speaker.name || "",
        organization: speaker.organization || "",
        bio: speaker.bio || "",
        title: speaker.title || "",
        avatar: speaker.avatar || "",
        sessions: speaker.sessions || [],
      })
    }
  }, [speaker, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Get organizations from existing speakers data
  const getOrganizationsFromData = () => {
    const orgs = new Set<string>()
    speakersData.forEach((speaker) => {
      if (speaker.organization) {
        orgs.add(speaker.organization)
      }
    })
    return Array.from(orgs)
  }

  const organizations = getOrganizationsFromData()

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          {formData.avatar ? (
            <Image
              src={formData.avatar || "/placeholder.svg"}
              alt={formData.name}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xl font-bold">{formData.name ? formData.name.charAt(0) : "S"}</span>
          )}
        </div>
        <Button type="button" variant="outline" className="h-10">
          <Upload className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter speaker's full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Select
          value={formData.organization}
          onValueChange={(value) => setFormData({ ...formData, organization: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select or enter organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org} value={org}>
                {org}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (Enter below)</SelectItem>
          </SelectContent>
        </Select>
        {formData.organization === "other" && (
          <Input
            className="mt-2"
            placeholder="Enter organization name"
            value=""
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title/Position</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter speaker's title or position"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Enter speaker's biography"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          {mode === "create" ? "Add Speaker" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
