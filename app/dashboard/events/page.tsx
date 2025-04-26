import EventsList from "@/components/dashboard/events/events-list";
import { eventService } from "@/lib/services/event-service";
import { Suspense } from "react";

export default async function EventsPage({ searchParams }: { searchParams: { page?: string; limit?: string } }) {

  const page = searchParams?.page ? Number.parseInt(searchParams.page) : 1
  const limit = searchParams?.limit ? Number.parseInt(searchParams.limit) : 10

  const { data: events, meta } = await eventService.getEvents(page, limit)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      <Suspense fallback={<div>Loading events...</div>}>
        <EventsList events={events} pagination={meta} />
      </Suspense>
    </div>
  )

}