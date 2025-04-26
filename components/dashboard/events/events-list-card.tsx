"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"

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

export default function EventsListCard({ events, pagination }: EventsListProps) {
  const [page, setPage] = useState(pagination.page)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pageCount) return
    setPage(newPage)
    // Update URL with new page
    const url = new URL(window.location.href)
    url.searchParams.set("page", newPage.toString())
    window.history.pushState({}, "", url.toString())
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Events ({pagination.total})</h2>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No events found</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/events/new">Create your first event</Link>
            </Button>
          </div>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(event.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end justify-between">
                  <Badge
                    className={
                      new Date(event.startDate) > new Date()
                        ? "bg-green-100 text-green-800"
                        : new Date(event.endDate) < new Date()
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {new Date(event.startDate) > new Date()
                      ? "Upcoming"
                      : new Date(event.endDate) < new Date()
                        ? "Past"
                        : "Active"}
                  </Badge>

                  <div className="flex gap-2 mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/events/${event.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Sessions</p>
                  <p className="font-medium">{event.statistics.sessions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Speakers</p>
                  <p className="font-medium">{event.statistics.speakers}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Partners</p>
                  <p className="font-medium">{event.statistics.partners}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Registrations</p>
                  <p className="font-medium">{event.statistics.registrations}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
