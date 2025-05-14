"use client"

import { Calendar, Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Event } from "@prisma/client"
import { cn } from "@/lib/utils"

// Mock data for recent events
type PropsEvent = {
  recentEvents: (Event & { inviteCount: number })[]
}


export function RecentEventsList({ recentEvents }: PropsEvent) {

  if (!recentEvents || recentEvents.length === 0) {
    return <div className="text-gray-500">No recent events found.</div>
  }

  return (
    <div className="space-y-4">
      {recentEvents.map((event) => (
        <Link
          key={event.id}
          href={`/dashboard/events/${event.id}/details`}
          className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{event.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{event.startDate.toLocaleDateString()}</span> -
                  <Calendar className="h-4 w-4" />
                  <span>{event.endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{event.inviteCount}</span>
                </div>
              </div>
            </div>
            <Badge
              className={cn(
                "hover:bg-opacity-100",
                // Blue for UPCOMING
                event.status === "UPCOMING" &&
                "bg-blue-100 text-blue-800 hover:bg-blue-100",
                // Green for COMPLETED
                event.status === "COMPLETED" &&
                "bg-green-100 text-green-800 hover:bg-green-100",
                // Red fallback for all other cases (NOT ACTIVE and NOT COMPLETED)
                event.status === "ACTIVE" &&
                "bg-green-100 text-gray-800 hover:bg-green-100",
                // Red for CANCELLED
                event.status === "CANCELLED" && "bg-red-100 text-red-800 hover:bg-red-100"
              )}
            >
              {event.status === "ACTIVE" ? "ACTIVE" : event.status === "COMPLETED" ? "COMPLETED" : event.status === "UPCOMING" ? "UPCOMING" : "CANCELLED"}
            </Badge>

          </div>
        </Link>
      ))}
    </div>
  )
}
