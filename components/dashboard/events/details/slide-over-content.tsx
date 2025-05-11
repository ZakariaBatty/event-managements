"use client"

import { SlideOver } from "@/components/dashboard/slide-over"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Clock } from "lucide-react"
import Image from "next/image"
import { SessionForm } from "@/components/dashboard/session-form"
import { SpeakerForm } from "@/components/dashboard/speaker-form"
import { LocationForm } from "@/components/dashboard/location-form"
import { PartnerForm } from "@/components/dashboard/partner-form"
import { QRCodeForm } from "@/components/dashboard/qrcode-form"
import { EventForm } from "@/components/dashboard/event-form"
import type { Dispatch, SetStateAction } from "react"

interface SlideOverContentProps {
  slideOverOpen: boolean
  setSlideOverOpen: (open: boolean) => void
  slideOverContent: string
  selectedItem: any
  event: any
  onFormSubmit: (data: any) => void
  setSlideOverContent: (content: string) => void
  setSelectedItem: Dispatch<SetStateAction<any>>
}

export function SlideOverContent({
  slideOverOpen,
  setSlideOverOpen,
  slideOverContent,
  selectedItem,
  event,
  onFormSubmit,
  setSlideOverContent,
  setSelectedItem,
}: SlideOverContentProps) {
  const getTitle = () => {
    switch (slideOverContent) {
      case "addSession":
        return "Add Session"
      case "editSession":
        return "Edit Session"
      case "addSpeaker":
        return "Add Speaker"
      case "editSpeaker":
        return "Edit Speaker"
      case "viewSpeaker":
        return "Speaker Details"
      case "editLocation":
        return "Edit Location"
      case "addPartner":
        return "Add Partner"
      case "editPartner":
        return "Edit Partner"
      case "addQRCode":
        return "Add QR Code"
      case "editQRCode":
        return "Edit QR Code"
      case "editEvent":
        return "Edit Event"
      case "addSessionFromProgram":
        return "Add Session From Program"
      default:
        return ""
    }
  }

  return (
    <SlideOver open={slideOverOpen} onClose={() => setSlideOverOpen(false)} side="left" title={getTitle()}>
      <div className="p-4">
        {slideOverContent === "viewSpeaker" && selectedItem && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                <Image
                  src={selectedItem.avatar || "/placeholder.svg"}
                  alt={selectedItem.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
              <p className="text-gray-600">{selectedItem.organization || "No organization"}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Biography</h3>
                <p className="mt-1 text-gray-600">{selectedItem.bio || "No biography available"}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Sessions</h3>
                {selectedItem.sessions && selectedItem.sessions.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {selectedItem.sessions.map((sessionId: string) => {
                      const session = event.sessions.find((s: any) => s.id === sessionId)
                      return session ? (
                        <li key={sessionId} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleDateString()} • {session.time}
                          </p>
                        </li>
                      ) : null
                    })}
                  </ul>
                ) : (
                  <p className="mt-2 text-gray-500">No sessions assigned</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSlideOverOpen(false)}>
                Close
              </Button>
              <Button
                className="bg-primary hover:bg-primary-light"
                onClick={() => {
                  setSlideOverContent("editSpeaker")
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Speaker
              </Button>
            </div>
          </div>
        )}

        {slideOverContent === "addSession" && (
          <SessionForm mode="create" onSubmit={onFormSubmit} onCancel={() => setSlideOverOpen(false)} />
        )}

        {slideOverContent === "editSession" && selectedItem && (
          <SessionForm
            session={selectedItem}
            mode="edit"
            onSubmit={() => onFormSubmit({})}
            onCancel={() => setSlideOverOpen(false)}
          />
        )}

        {slideOverContent === "addSpeaker" && (
          <SpeakerForm mode="create" onSubmit={onFormSubmit} onCancel={() => setSlideOverOpen(false)} />
        )}

        {slideOverContent === "editSpeaker" && selectedItem && (
          <SpeakerForm
            speaker={selectedItem}
            mode="edit"
            onSubmit={() => onFormSubmit({})}
            onCancel={() => setSlideOverOpen(false)}
          />
        )}

        {slideOverContent === "editLocation" && (
          <LocationForm location={event} onSubmit={onFormSubmit} onCancel={() => setSlideOverOpen(false)} />
        )}

        {slideOverContent === "addPartner" && (
          <PartnerForm mode="create" onSubmit={onFormSubmit} onCancel={() => setSlideOverOpen(false)} />
        )}

        {slideOverContent === "editPartner" && selectedItem && (
          <PartnerForm
            partner={selectedItem}
            mode="edit"
            onSubmit={() => onFormSubmit({})}
            onCancel={() => setSlideOverOpen(false)}
          />
        )}

        {slideOverContent === "addQRCode" && (
          <QRCodeForm mode="create" onSubmit={onFormSubmit} onCancel={() => setSlideOverOpen(false)} />
        )}

        {slideOverContent === "editQRCode" && selectedItem && (
          <QRCodeForm
            qrCode={selectedItem}
            mode="edit"
            onSubmit={() => onFormSubmit({})}
            onCancel={() => setSlideOverOpen(false)}
          />
        )}

        {slideOverContent === "editEvent" && (
          <EventForm
            event={event}
            mode="edit"
            onSubmit={(data) => onFormSubmit(data)}
            onCancel={() => setSlideOverOpen(false)}
          />
        )}

        {slideOverContent === "addSessionFromProgram" && selectedItem && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select a session from program data</h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-3">
              {selectedItem.length > 0 ? (
                selectedItem.map((session: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Pre-fill the session form with this data
                      const sessionData = {
                        ...session,
                        date:
                          session.date && typeof session.date === "string"
                            ? new Date(session.date.split(" ")[0].split("/").reverse().join("-"))
                            : new Date(),
                      }
                      setSelectedItem(sessionData)
                      setSlideOverContent("addSession")
                    }}
                  >
                    <h4 className="font-medium">
                      {session.title} {session.description}
                    </h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{session.date || "Date not set"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.time || "Time not set"}</span>
                      </div>
                    </div>
                    {session.speakers && session.speakers.length > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Speakers:</span> {session.speakers.join(", ")}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No program data available</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSlideOverOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  )
}
