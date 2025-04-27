"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Edit, MapPin } from "lucide-react"

interface LocationTabProps {
  event: any
  onOpenSlideOver: (content: string, item?: any) => void
}

export function LocationTab({ event, onOpenSlideOver }: LocationTabProps) {
  if (!event || !event.location) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Location</CardTitle>
          <CardDescription>Manage venue details</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No location set"
            description="The event location has not been set yet."
            icon={<MapPin className="h-12 w-12" />}
            action={
              <Button onClick={() => onOpenSlideOver("editLocation", event)}>
                <Edit className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            }
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Location</CardTitle>
        <CardDescription>Manage venue details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Venue Name</h3>
              <p className="mt-1">{event.venueName || "Parc des Expositions"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1">{event.location || "Agadir, Morocco"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Coordinates</h3>
            <p className="mt-1">{event.coordinates || "Not specified"}</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => onOpenSlideOver("editLocation", event)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
