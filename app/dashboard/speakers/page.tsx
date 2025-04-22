"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { PlusCircle, Mic, Building, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { speakersData } from "@/data/program"

export default function SpeakersPage() {
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedSpeaker, setSelectedSpeaker] = useState<any>(null)

  // Remove duplicates based on name
  const uniqueSpeakers = speakersData
    .filter((speaker, index, self) => index === self.findIndex((s) => s.name === speaker.name))
    .map((speaker, index) => ({
      ...speaker,
      id: `speaker-${index + 1}`,
    }))

  const columns = [
    {
      key: "name",
      label: "Speaker",
      isTitle: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={item.pdfUrl || ""} alt={value} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {value
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-primary">{value}</div>
            <div className="text-sm text-gray-500">{item.title || "Speaker"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "organization",
      label: "Organization",
      render: (value: string) => (
        <div className="flex items-center">
          <Building className="mr-1 h-4 w-4 text-accent" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "eventType",
      label: "Event Type",
      render: (value: string) => {
        const types: Record<string, string> = {
          MASTER_CLASS: "Master Class",
          SIDE_EVENT: "Side Event",
          SHOWCASE: "Showcase",
          ROUNDTABLE: "Table Ronde",
          NETWORKING: "Networking",
        }

        return (
          <div className="flex items-center">
            <Mic className="mr-1 h-4 w-4 text-success" />
            <Badge
              className={
                value === "MASTER_CLASS"
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : value === "SIDE_EVENT"
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : value === "SHOWCASE"
                      ? "bg-warning/10 text-warning hover:bg-warning/20"
                      : value === "ROUNDTABLE"
                        ? "bg-accent/10 text-accent hover:bg-accent/20"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            >
              {types[value] || value}
            </Badge>
          </div>
        )
      },
    },
    {
      key: "title",
      label: "Presentation",
      render: (value: string) => (
        <div className="flex items-center">
          <Tag className="mr-1 h-4 w-4 text-warning" />
          <span>{value || "-"}</span>
        </div>
      ),
    },
  ]

  const handleCreateSpeaker = () => {
    setSelectedSpeaker(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditSpeaker = (speaker: any) => {
    setSelectedSpeaker(speaker)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewSpeaker = (speaker: any) => {
    setSelectedSpeaker(speaker)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteSpeaker = (speaker: any) => {
    // In a real app, you would call an API to delete the speaker
    console.log("Delete speaker:", speaker)
    alert(`Speaker "${speaker.name}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the speaker
    setSlideOverOpen(false)
    alert(`Speaker would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Speakers
          </h1>
          <p className="text-gray-500 mt-1">Manage your event speakers and presentations</p>
        </div>
        <Button onClick={handleCreateSpeaker} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Speaker
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={uniqueSpeakers}
          columns={columns}
          onEdit={handleEditSpeaker}
          onDelete={handleDeleteSpeaker}
          onView={handleViewSpeaker}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="left"
        title={
          slideOverMode === "create" ? "Add New Speaker" : slideOverMode === "edit" ? "Edit Speaker" : "Speaker Details"
        }
      >
        <div className="p-4">
          {/* Speaker form would go here */}
          <p>Speaker form content</p>
        </div>
      </SlideOver>
    </div>
  )
}
