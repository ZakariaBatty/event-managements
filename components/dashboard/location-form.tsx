"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"
import { locationData } from "@/data/program"

interface LocationFormProps {
  location?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function LocationForm({ location, onSubmit, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    coordinates: "",
    mapUrl: "",
    directions: "",
  })

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || locationData.name || "",
        address: location.address || locationData.address || "",
        coordinates: location.coordinates || locationData.coordinates || "",
        mapUrl: location.mapUrl || locationData.mapUrl || "",
        directions: location.directions || "",
      })
    }
  }, [location])

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Venue Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter venue name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter venue address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coordinates">GPS Coordinates</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="coordinates"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
            placeholder="e.g. 30.4278° N, 9.5981° W"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mapUrl">Google Maps URL</Label>
        <Input
          id="mapUrl"
          name="mapUrl"
          value={formData.mapUrl}
          onChange={handleChange}
          placeholder="https://maps.google.com/?q=..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="directions">Directions</Label>
        <Textarea
          id="directions"
          name="directions"
          value={formData.directions}
          onChange={handleChange}
          placeholder="How to get to the venue..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary-light">
          Save Location
        </Button>
      </div>
    </form>
  )
}
