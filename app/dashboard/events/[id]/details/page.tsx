"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getEventAction } from "@/lib/actions/event-actions"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState } from "@/components/ui/loading-state"
import { EventHeader } from "@/components/dashboard/events/details/event-header"
import { EventStatistics } from "@/components/dashboard/events/details/event-statistics"
import { EventDetails } from "@/components/dashboard/events/details/event-details"
import { EventTabs } from "@/components/dashboard/events/details/event-tabs"
import { programData } from "@/data/program"
import { SlideOverContent } from "@/components/dashboard/events/details/slide-over-content"

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

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)

    if (slideOverContent === "addSession") {
      const newSession = {
        id: `s${event.sessions.length + 1}`,
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
    } else if (slideOverContent === "editSession" && selectedItem) {
      const updatedSessions = event.sessions.map((session: any) =>
        session.id === selectedItem.id ? { ...session, ...data } : session,
      )
      setEvent({
        ...event,
        sessions: updatedSessions,
      })
    } else if (slideOverContent === "addSpeaker") {
      const newSpeaker = {
        id: `sp${event.speakers.length + 1}`,
        ...data,
      }
      setEvent({
        ...event,
        speakers: [...event.speakers, newSpeaker],
        statistics: {
          ...event.statistics,
          speakers: event.statistics.speakers + 1,
        },
      })
    } else if (slideOverContent === "editSpeaker" && selectedItem) {
      const updatedSpeakers = event.speakers.map((speaker: any) =>
        speaker.id === selectedItem.id ? { ...speaker, ...data } : speaker,
      )
      setEvent({
        ...event,
        speakers: updatedSpeakers,
      })
    } else if (slideOverContent === "editLocation") {
      setEvent({
        ...event,
        ...data,
      })
    } else if (slideOverContent === "addPartner") {
      const newPartner = {
        id: `p${event.partners.length + 1}`,
        ...data,
      }
      setEvent({
        ...event,
        partners: [...event.partners, newPartner],
        statistics: {
          ...event.statistics,
          partners: event.statistics.partners + 1,
        },
      })
    } else if (slideOverContent === "editPartner" && selectedItem) {
      const updatedPartners = event.partners.map((partner: any) =>
        partner.id === selectedItem.id ? { ...partner, ...data } : partner,
      )
      setEvent({
        ...event,
        partners: updatedPartners,
      })
    } else if (slideOverContent === "addQRCode") {
      const newQRCode = {
        id: `qr${event.qrCodes.length + 1}`,
        ...data,
      }
      setEvent({
        ...event,
        qrCodes: [...event.qrCodes, newQRCode],
      })
    } else if (slideOverContent === "editQRCode" && selectedItem) {
      const updatedQRCodes = event.qrCodes.map((qrCode: any) =>
        qrCode.id === selectedItem.id ? { ...qrCode, ...data } : qrCode,
      )
      setEvent({
        ...event,
        qrCodes: updatedQRCodes,
      })
    } else if (slideOverContent === "editEvent") {
      setEvent({
        ...event,
        ...data,
      })
    }

    setSlideOverOpen(false)
  }

  const handleDeleteItem = (type: string, id: string) => {
    if (type === "session") {
      const updatedSessions = event.sessions.filter((session: any) => session.id !== id)
      setEvent({
        ...event,
        sessions: updatedSessions,
        statistics: {
          ...event.statistics,
          sessions: event.statistics.sessions - 1,
        },
      })
    } else if (type === "speaker") {
      const updatedSpeakers = event.speakers.filter((speaker: any) => speaker.id !== id)
      setEvent({
        ...event,
        speakers: updatedSpeakers,
        statistics: {
          ...event.statistics,
          speakers: event.statistics.speakers - 1,
        },
      })
    } else if (type === "partner") {
      const updatedPartners = event.partners.filter((partner: any) => partner.id !== id)
      setEvent({
        ...event,
        partners: updatedPartners,
        statistics: {
          ...event.statistics,
          partners: event.statistics.partners - 1,
        },
      })
    } else if (type === "qrCode") {
      const updatedQRCodes = event.qrCodes.filter((qrCode: any) => qrCode.id !== id)
      setEvent({
        ...event,
        qrCodes: updatedQRCodes,
      })
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