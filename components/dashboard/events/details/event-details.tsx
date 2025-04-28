import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateWithShortMonth } from "@/lib/utils"

interface EventDetailsProps {
  event: any
}

export function EventDetails({ event }: EventDetailsProps) {
  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Basic information about the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">No event details available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>Basic information about the event</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
              <p className="mt-1">{event.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">URL Slug</h3>
              <p className="mt-1">{event.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
              <p className="mt-1">{event.startDate ? formatDateWithShortMonth(event.startDate) : "Not set"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">End Date</h3>
              <p className="mt-1">{event.endDate ? formatDateWithShortMonth(event.endDate) : "Not set"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1">{event.location || "No location set"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{event.description || "No description available"}</p>
          </div>

          <h3 className="text-sm font-medium text-gray-500">Organizers</h3>
          <ul className="list-disc pl-5 space-y-1">
            {event.organizers.map((org: string, index: number) => (
              <li key={index} className="mt-1">
                {org}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-medium text-gray-500">Goals</h3>
          <p className="mt-1">
            {event.goals ? event.goals : "No goals set"}
          </p>

          <h3 className="text-sm font-medium text-gray-500">Themes</h3>
          {event.themes.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {event.themes.map((theme: any, index: number) => (
                <li key={index} className="mt-1">
                  {theme}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1">No themes set</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
