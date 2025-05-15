import EventsList from "@/components/dashboard/events/events-list";
import DashboardSkeleton from "@/components/DashboardSkeleton ";
import { eventService } from "@/lib/services/event-service";
import { Suspense } from "react";

export default async function EventsPage({ searchParams }: { searchParams: { page?: string; limit?: string } }) {
  const param = await searchParams
  const page = param?.page ? Number.parseInt(param?.page) : 1
  const limit = param?.limit ? Number.parseInt(param?.limit) : 10

  const { data: events, meta } = await eventService.getEvents(page, limit)
  return (
    <div className="mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <EventsList events={events} pagination={meta} />
      </Suspense>
    </div>
  )

}