"use client"

import { Calendar, Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for recent events
const recentEvents = [
  {
    id: "1",
    name: "Salon Halieutis 2025",
    date: "Feb 5-8, 2025",
    location: "Agadir, Morocco",
    attendees: 1200,
    status: "upcoming",
  },
  {
    id: "2",
    name: "Tech Conference 2024",
    date: "Dec 10-12, 2024",
    location: "Casablanca, Morocco",
    attendees: 800,
    status: "upcoming",
  },
  {
    id: "3",
    name: "Marketing Summit",
    date: "Nov 15, 2024",
    location: "Rabat, Morocco",
    attendees: 350,
    status: "active",
  },
  {
    id: "4",
    name: "Business Expo 2024",
    date: "Oct 5-7, 2024",
    location: "Marrakech, Morocco",
    attendees: 950,
    status: "completed",
  },
  {
    id: "5",
    name: "Innovation Forum",
    date: "Sep 20, 2024",
    location: "Tangier, Morocco",
    attendees: 420,
    status: "completed",
  },
]

export function RecentEventsList() {
  return (
    <div className="space-y-4">
      {recentEvents.map((event) => (
        <Link
          key={event.id}
          href={`/dashboard/events/${event.id}`}
          className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{event.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees}</span>
                </div>
              </div>
            </div>
            <Badge
              className={
                event.status === "upcoming"
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  : event.status === "active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
              }
            >
              {event.status === "upcoming" ? "Upcoming" : event.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}
