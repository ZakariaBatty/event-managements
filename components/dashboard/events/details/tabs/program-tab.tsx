"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Edit, MapPin, PlusCircle, Trash } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { formatDateWithShortMonth } from "@/lib/utils"
import { SessionSpeakers } from "./session-speakers"

interface ProgramTabProps {
  sessions: any[]
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
  onAddSessionFromProgram: () => void
}

export function ProgramTab({ sessions, onOpenSlideOver, onDeleteItem, onAddSessionFromProgram }: ProgramTabProps) {

  const handleSpeakerClick = (speaker: any) => {
    console.log("Speaker clicked:", speaker)
  }
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


  const sessionsByDate = sessions.reduce((acc: Record<string, any[]>, session: any) => {
    if (!session.date) return acc;

    const dateObj = new Date(session.date);
    const formattedDate = dateObj.toISOString().split('T')[0]; // يعطينا مثلا 2024-01-20

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(session);
    return acc;
  }, {});

  // نرتبو التواريخ
  const sortedDates = Object.keys(sessionsByDate).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });


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
          {sortedDates.map((date) => (
            <div key={date} className="border rounded-lg p-4">

              {/* header dyal date + buttons */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDateWithShortMonth(date)}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onOpenSlideOver("editSession", sessionsByDate)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* sessions dyal dak nhar */}
              <div className="space-y-2">
                {sessionsByDate[date].map((session: any) => (
                  <div key={session.id} className="border rounded-md p-3 ">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {session.type === "MASTER_CLASS" && <span className="text-blue-500">MASTER CLASS:</span>}
                        {session.type === "WORKSHOP" && <span className="text-gray-700">WORKSHOP:</span>}
                        {session.type === "PANEL" && <span className="text-green-600">PANEL:</span>}
                        {session.type === "KEYNOTE" && <span className="text-amber-600">KEYNOTE:</span>}
                        {session.type === "NETWORKING" && <span className="text-purple-600">CONFÉRENCE DU SALON HALIEUTIS</span>}
                        <div className="text-base font-semibold">{session.title}</div>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{session.time ? `${session.time} - ${session.time}` : "Time not set"}</span>
                      </div>
                      <SessionSpeakers speakers={session.speakers} onSpeakerClick={handleSpeakerClick} />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
