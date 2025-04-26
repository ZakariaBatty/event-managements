"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { EventForm } from "@/components/dashboard/event-form"
import { PlusCircle, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function EventsPage() {
  const router = useRouter()
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  // Mock data for events
  const events = [
    {
      id: "evt-001",
      name: "Salon Halieutis 2025",
      slug: "salon-halieutis-2025",
      description: "International fisheries exhibition",
      location: "Agadir, Morocco",
      startDate: "2025-02-05T09:00:00",
      endDate: "2025-02-08T18:00:00",
      status: "upcoming",
    },
    {
      id: "evt-002",
      name: "Tech Conference 2024",
      slug: "tech-conference-2024",
      description: "Annual technology conference",
      location: "Casablanca, Morocco",
      startDate: "2024-11-15T09:00:00",
      endDate: "2024-11-17T18:00:00",
      status: "upcoming",
    },
    {
      id: "evt-003",
      name: "Marketing Summit",
      slug: "marketing-summit",
      description: "Digital marketing strategies summit",
      location: "Rabat, Morocco",
      startDate: "2024-09-20T09:00:00",
      endDate: "2024-09-21T18:00:00",
      status: "upcoming",
    },
    {
      id: "evt-004",
      name: "Business Expo 2023",
      slug: "business-expo-2023",
      description: "Annual business exhibition",
      location: "Marrakech, Morocco",
      startDate: "2023-12-10T09:00:00",
      endDate: "2023-12-12T18:00:00",
      status: "past",
    },
    {
      id: "evt-005",
      name: "Agriculture Fair 2023",
      slug: "agriculture-fair-2023",
      description: "International agriculture exhibition",
      location: "Meknes, Morocco",
      startDate: "2023-10-05T09:00:00",
      endDate: "2023-10-10T18:00:00",
      status: "past",
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Event Name",
      isTitle: true,
      titlePath: "/dashboard/events/:id/details",
      render: (value: string) => <div className="font-medium text-primary">{value}</div>,
    },
    {
      key: "location",
      label: "Location",
      render: (value: string) => (
        <div className="flex items-center">
          <MapPin className="mr-1 h-4 w-4 text-warning" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "startDate",
      label: "Date",
      render: (value: string, item: any) => (
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4 text-primary" />
          <span>
            {format(new Date(value), "MMM d, yyyy")} - {format(new Date(item.endDate), "MMM d, yyyy")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          className={
            value === "upcoming"
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }
        >
          {value === "upcoming" ? "Upcoming" : "Past"}
        </Badge>
      ),
    },
  ]

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewEvent = (event: any) => {
    router.push(`/dashboard/events/${event.id}/details`)
  }

  const handleDeleteEvent = (event: any) => {
    // In a real app, you would call an API to delete the event
    console.log("Delete event:", event)
    alert(`Event "${event.name}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the event
    setSlideOverOpen(false)
    alert(`Event would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Events
          </h1>
          <p className="text-gray-500 mt-1">Manage your events and activities</p>
        </div>
        <Button onClick={handleCreateEvent} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={events}
          columns={columns}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onView={handleViewEvent}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="right"
        title={
          slideOverMode === "create" ? "Create New Event" : slideOverMode === "edit" ? "Edit Event" : "Event Details"
        }
      >
        <EventForm
          event={selectedEvent}
          mode={slideOverMode}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseSlideOver}
        />
      </SlideOver>
    </div>
  )
}
