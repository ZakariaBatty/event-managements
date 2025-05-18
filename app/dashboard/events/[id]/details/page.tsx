"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getEventAction, updateEvent } from "@/lib/actions/event-actions"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import { EventHeader } from "@/components/dashboard/events/details/event-header"
import { EventStatistics } from "@/components/dashboard/events/details/event-statistics"
import { EventDetails } from "@/components/dashboard/events/details/event-details"
import { EventTabs } from "@/components/dashboard/events/details/event-tabs"
import { programData } from "@/data/program"
import { SlideOverContent } from "@/components/dashboard/events/details/slide-over-content"
import { createSideEventItem, deleteSideEventItem, updateSideEventItem } from "@/lib/actions/programme-actions"
import { toast } from "@/components/ui/use-toast"
import { normalizeDateToISODateOnly } from "@/lib/utils"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverContent, setSlideOverContent] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    const getEvent = async () => {
      try {
        const eventData = await getEventAction(eventId)
        setEvent(eventData)
      } catch (error) {
        console.error("Failed to fetch event:", error)
      } finally {
        setLoading(false)
      }
    }

    getEvent()
  }, [eventId])

  const openSlideOver = (content: string, item?: any) => {
    setSlideOverContent(content)
    setSelectedItem(item)
    setSlideOverOpen(true)
  }

  const handleFormSubmit = async (data: any) => {

    if (slideOverContent === "addSession") {
      // Create a new FormData object for the server action
      const formData = new FormData()
      formData.append("time", data.time)
      formData.append("type", data.type)
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("date", data.date instanceof Date ? normalizeDateToISODateOnly(data.date) : normalizeDateToISODateOnly(new Date(data.date)));
      formData.append("eventId", eventId)
      formData.append("speakers", Array.isArray(data.speakers) ? data.speakers.join(",") : "")
      formData.append("location", data.location)
      // Call the server action
      const result = await createSideEventItem(formData)

      if (result.success) {
        // Update local state for immediate UI update
        const newSession = {
          id: result.data?.id || `s${event.sideEvents.length + 1}`,
          ...data,
        }
        setEvent({
          ...event,
          sessions: [...event.sessions, newSession],
          statistics: {
            ...event.statistics,
            sessions: event.statistics.sessions + 1,
          },
        })
        toast({
          title: "Success!",
          description: "Session added successfully.",
        })
        setSlideOverOpen(false)
      } else {
        toast({
          title: "Error!",
          description: result.error || "Failed to add session.",
          variant: "destructive",
        })
      }
    } else if (slideOverContent === "editSession" && selectedItem) {
      // Create a new FormData object for the server action
      const formData = new FormData()
      formData.append("time", data.time)
      formData.append("type", data.type)
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("date", data.date instanceof Date ? normalizeDateToISODateOnly(data.date) : normalizeDateToISODateOnly(new Date(data.date)));
      formData.append("speakers", Array.isArray(data.speakers) ? data.speakers : [])
      formData.append("location", data.location)
      // Call the server action
      const result = await updateSideEventItem(selectedItem.id, formData)

      if (result.success) {
        // Update local state for immediate UI update
        const updatedSessions = event.sessions.map((session: any) =>
          session.id === selectedItem.id ? { ...session, ...data } : session,
        )
        setEvent({
          ...event,
          sessions: updatedSessions,
        })
        toast({
          title: "Success!",
          description: "Session updated successfully.",
        })
        setSlideOverOpen(false)
      } else {
        console.error("Failed to update session:", result.error)
        toast({
          title: "Error!",
          description: result.error || "Failed to update session.",
          variant: "destructive",
        })
      }
      return
    } else if (slideOverContent === "addSpeaker") {
    } else if (slideOverContent === "editSpeaker" && selectedItem) {
    } else if (slideOverContent === "editLocation") {
    } else if (slideOverContent === "addPartner") {
    } else if (slideOverContent === "editPartner" && selectedItem) {
    } else if (slideOverContent === "addQRCode") {
    } else if (slideOverContent === "editQRCode" && selectedItem) {
    } else if (slideOverContent === "editEvent") {
      const result = await updateEvent(event.id, data)
      if (result.success) {
        setEvent(result.data)
        toast({
          variant: "default",
          title: "Event updated!",
          description: "Your Event has been successfully updated."
        })
      }
    }

    setSlideOverOpen(false)
  }

  const handleDeleteItem = async (type: string, id: string) => {
    let result
    if (type === "session") {
      result = await deleteSideEventItem(id)
      if (result.success) {
        const updatedSessions = event.sessions.filter((session: any) => session.id !== id)
        setEvent({
          ...event,
          sessions: updatedSessions,
          statistics: {
            ...event.statistics,
            sessions: event.statistics.sessions - 1,
          },
        })
        toast({
          title: "Success!",
          description: "Session deleted successfully.",
        })
      } else {
        toast({
          title: "Error!",
          description: result.error || "Failed to delete session.",
          variant: "destructive",
        })
      }
    } else if (type === "speaker") {
    } else if (type === "partner") {
    } else if (type === "qrCode") {
    }
  }

  // Function to add a session from program data
  const addSessionFromProgram = () => {
    // Get all sessions from program data
    const programSessions: any[] = []
    if (typeof programData !== "undefined" && programData.sideEvent) {
      programData.sideEvent.forEach((day) => {
        day.items.forEach((item) => {
          programSessions.push({
            title: item.title + " " + item.description,
            date: day.date,
            time: item.time,
            type: item.type,
            description: item.description,
            speakers: item.speakers ? item.speakers.map((s) => s.name) : [],
            location: "To be determined",
          })
        })
      })
    }

    openSlideOver("addSessionFromProgram", programSessions)
  }

  if (loading) {
    return <LoadingState message="Loading event details..." />
  }

  if (!event) {
    return (
      <EmptyState
        title="Event not found"
        description="The event you're looking for doesn't exist or has been removed."
        action={<Button onClick={() => router.back()}>Go Back</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/events")} className="h-8 w-8 mr-4">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <EventHeader event={event} onEditEvent={() => openSlideOver("editEvent", event)} />
      </div>

      <EventStatistics statistics={event.statistics} />
      <EventDetails event={event} />

      <EventTabs
        event={event}
        onOpenSlideOver={openSlideOver}
        onDeleteItem={handleDeleteItem}
        onAddSessionFromProgram={addSessionFromProgram}
      />

      <SlideOverContent
        slideOverOpen={slideOverOpen}
        setSlideOverOpen={setSlideOverOpen}
        slideOverContent={slideOverContent}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        event={event}
        onFormSubmit={handleFormSubmit}
        setSlideOverContent={setSlideOverContent}
      />
    </div>
  )
}