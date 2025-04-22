"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/dashboard/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { programData } from "@/data/program"

// Mock data for now, will be replaced with actual data from the server
const eventTypes = [
  { value: "MASTER_CLASS", label: "Master Class" },
  { value: "SIDE_EVENT", label: "Side Event" },
  { value: "SHOWCASE", label: "Showcase" },
  { value: "ROUNDTABLE", label: "Table Ronde" },
  { value: "NETWORKING", label: "Networking" },
]

export default function ProgrammePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  // Convert the program data to a flat array for the table
  const flattenedEvents = programData.sideEvent.flatMap((day) =>
    day.items.map((item) => ({
      ...item,
      date: day.date,
      id: `${day.date}-${item.time}-${item.description}`, // Create a unique ID
    })),
  )

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleDelete = (event: any) => {
    // This would call the server action to delete the event
    console.log("Delete event:", event)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would call the server action to save the event
    console.log("Save event:", editingEvent)
    setIsDialogOpen(false)
    setEditingEvent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion du Programme</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={editingEvent?.date ? new Date(editingEvent.date).toISOString().split("T")[0] : ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input id="time" placeholder="ex: 14h00 - 16h00" defaultValue={editingEvent?.time || ""} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'événement</Label>
                <Select defaultValue={editingEvent?.type || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de l'événement"
                  defaultValue={editingEvent?.description || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speakers">Intervenants (séparés par des virgules)</Label>
                <Textarea
                  id="speakers"
                  placeholder="Noms des intervenants"
                  defaultValue={editingEvent?.speakers?.map((s: any) => s.name).join(", ") || ""}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingEvent ? "Mettre à jour" : "Ajouter"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programme de l'événement</CardTitle>
          <CardDescription>Gérez les événements, les horaires et les intervenants</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={flattenedEvents}
            columns={[
              { key: "date", label: "Date" },
              { key: "time", label: "Heure" },
              {
                key: "type",
                label: "Type",
                render: (value) => {
                  const type = eventTypes.find((t) => t.value === value)
                  return type?.label || value
                },
              },
              { key: "description", label: "Description" },
              {
                key: "speakers",
                label: "Intervenants",
                render: (speakers) => (speakers ? speakers.map((s: any) => s.name).join(", ") : "-"),
              },
            ]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  )
}
