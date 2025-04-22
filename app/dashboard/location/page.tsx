"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { locationData } from "@/data/program"

export default function LocationPage() {
  const [location, setLocation] = useState(locationData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would call the server action to save the location
    console.log("Save location:", location)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion du Lieu</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations sur le lieu</CardTitle>
          <CardDescription>Gérez les informations sur le lieu de l'événement</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du lieu</Label>
              <Input
                id="name"
                value={location.name}
                onChange={(e) => setLocation({ ...location, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">Coordonnées GPS</Label>
              <Input
                id="coordinates"
                value={location.coordinates}
                onChange={(e) => setLocation({ ...location, coordinates: e.target.value })}
                placeholder="ex: 30.4278° N, 9.5981° W"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapUrl">URL Google Maps</Label>
              <Input
                id="mapUrl"
                value={location.mapUrl}
                onChange={(e) => setLocation({ ...location, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directions">Comment s'y rendre</Label>
              <Textarea
                id="directions"
                value={location.directions || ""}
                onChange={(e) => setLocation({ ...location, directions: e.target.value })}
                placeholder="Instructions pour se rendre au lieu"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
