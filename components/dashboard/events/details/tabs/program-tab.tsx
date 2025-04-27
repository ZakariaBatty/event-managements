"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Edit, MapPin, PlusCircle, Trash } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"

interface ProgramTabProps {
  sessions: any[]
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
  onAddSessionFromProgram: () => void
}

export function ProgramTab({ sessions, onOpenSlideOver, onDeleteItem, onAddSessionFromProgram }: ProgramTabProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardHeader className="flex !flex-row justify-between items-center">
          <div>
            <CardTitle>Event Program</CardTitle>
            <CardDescription>Manage the schedule and sessions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onAddSessionFromProgram} variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              From Program Data
            </Button>
            <Button size="sm" onClick={() => onOpenSlideOver("addSession")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Session
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No sessions found"
            description="There are no sessions for this event yet. Add your first session to get started."
            action={
              <Button onClick={() => onOpenSlideOver("addSession")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex !flex-row justify-between items-center">
        <div>
          <CardTitle>Event Program</CardTitle>
          <CardDescription>Manage the schedule and sessions</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onAddSessionFromProgram} variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            From Program Data
          </Button>
          <Button size="sm" onClick={() => onOpenSlideOver("addSession")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-[60vh] overflow-y-auto space-y-4">
          {sessions.map((session: any) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date ? new Date(session.date).toLocaleDateString() : "Date not set"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.time || "Time not set"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{session.location || "Location not set"}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{session.description || "No description available"}</p>
                  {session.speakers && session.speakers.length > 0 ? (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Speakers:</span> {session.speakers.join(", ")}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">No speakers assigned</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenSlideOver("editSession", session)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => onDeleteItem("session", session.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
