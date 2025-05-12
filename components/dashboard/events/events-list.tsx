"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { EventForm } from "@/components/dashboard/event-form"
import { PlusCircle, Calendar, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { calculateStatus, formatDateWithShortMonth } from "@/lib/utils"
import { createEvent, updateEvent } from "@/lib/actions/event-actions"
import { eventSchema } from "@/lib/validations"
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date
  location: string | null
  statistics: {
    sessions: number
    speakers: number
    partners: number
    registrations: number
    clients: number
  }
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  pageCount: number
}

interface EventsListProps {
  events: Event[]
  pagination: PaginationMeta
}

export default function EventsList({ events, pagination }: EventsListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  const columns = [
    {
      key: "title",
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
            {formatDateWithShortMonth(value)} - {formatDateWithShortMonth(item.endDate)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string, item: any) => {
        const formatingValue = calculateStatus(item.startDate, item.endDate, value as any)
        return (
          <Badge
            className={
              formatingValue === "upcoming"
                ? "bg-success/10 text-success hover:bg-success/20"
                : formatingValue === "started"
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : formatingValue === "past"
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : formatingValue === "draft"
                      ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      : formatingValue === "cancelled"
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
            }
          >
            {formatingValue.charAt(0).toUpperCase() + formatingValue.slice(1)}
          </Badge>
        )
      },
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
    alert(`Event "${event.title}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = async (data: any) => {
    setLoading(true)
    const parsed = eventSchema.safeParse(data);

    if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      throw new Error('Invalid data format');
    }
    const { data: validatedData } = parsed
    if (slideOverMode === "edit") {
      const result = await updateEvent(selectedEvent.id, validatedData)
      console.log("Update event:", result)
      if (result.success) {
        toast({
          variant: "default",
          title: "Event updated!",
          description: "Your Event has been successfully updated."
        })
      }
    } else {
      const result = await createEvent(validatedData)
      console.log("Create event:", result)
      if (result.success) {
        toast({
          variant: "default",
          title: "Event created!",
          description: "Your Event has been successfully create."
        })
      }
    }
    setLoading(false)
    setSlideOverOpen(false)
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
          pagination={pagination}
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
          loading={loading}
        />
      </SlideOver>
    </div>
  )
}
