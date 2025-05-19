/* eslint-disable react-hooks/exhaustive-deps */
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
import { useFormValidation } from "@/hooks/use-form-validation"
import { speakerSchema } from "@/lib/schemas"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createSpeaker, updateSpeaker } from "@/lib/actions/speaker-actions"

interface SpeakerFormProps {
  eventId: string,
  speaker?: any
  mode: "create" | "edit"
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SpeakerForm({ eventId, speaker, mode, onSubmit, onCancel }: SpeakerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: mode === "edit" ? speaker.name || "" : "",
    organization: mode === "edit" ? speaker.organization || "" : "",
    bio: mode === "edit" ? speaker.bio || "" : "",
    title: mode === "edit" ? speaker.title || "" : "",
    avatar: mode === "edit" ? speaker.avatar || "" : "",
    sessions: mode === "edit" ? speaker.sessions || [] : [],
    eventId: eventId || "",
  })

  const { validate, getFieldError } = useFormValidation(speakerSchema)


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate(formData)) {
      return
    }

    setIsSubmitting(true)
    try {
      // Direct submission to server action with typed data
      const result = mode === "create" ? await createSpeaker(formData) : await updateSpeaker(speaker.id, formData)
      console.log("Form submitted successfully:", result)
      if (result.success) {
        toast({
          title: "Success!",
          description: `Speaker ${mode === "create" ? "created" : "updated"} successfully.`,
        })

        // Either call the onSubmit callback or refresh the page
        if (onSubmit) {
          onSubmit(result.data)
        } else {
          router.refresh()
        }
      } else {
        // Handle validation errors from the server
        if (result.fieldErrors) {
          // You could set these errors in your form state
          toast({
            title: "Validation Error",
            description: "Please check the form for errors.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Something went wrong",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
          className={getFieldError("name") ? "border-red-500" : ""}
        />
        {getFieldError("name") && <p className="text-sm text-red-500">{getFieldError("name")}</p>}
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
          className={getFieldError("bio") ? "border-red-500" : ""}
        />
        {getFieldError("bio") && <p className="text-sm text-red-500">{getFieldError("bio")}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : mode === "create" ? "Add Speaker" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
