"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface EventHeaderProps {
  event: any
  onEditEvent: () => void
}

export function EventHeader({ event, onEditEvent }: EventHeaderProps) {
  if (!event) return null

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <Badge
          className={
            event.status === "upcoming"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-100 ml-2"
              : event.status === "active"
                ? "bg-green-100 text-green-800 hover:bg-green-100 ml-2"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100 ml-2"
          }
        >
          {event.status === "upcoming" ? "Upcoming" : event.status === "active" ? "Active" : "Completed"}
        </Badge>
      </div>
      <Button onClick={onEditEvent} className="bg-primary hover:bg-primary-light">
        <Edit className="mr-2 h-4 w-4" />
        Edit Event
      </Button>
    </div>
  )
}
