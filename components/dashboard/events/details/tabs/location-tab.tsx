"use client"


import "leaflet/dist/leaflet.css"
import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { parseGoogleMapsUrl } from "@/lib/utils"
import { Edit, MapPin } from "lucide-react"

interface LocationTabProps {
  event: any
  onOpenSlideOver: (content: string, item?: any) => void
}

// 👇 dynamic import without SSR
const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
})

export function LocationTab({ event, onOpenSlideOver }: LocationTabProps) {
  const location = parseGoogleMapsUrl(event.location)

  if (!event || !event.location || !location) {
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

  const center: LatLngExpression = [location.latitude, location.longitude]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Location</CardTitle>
        <CardDescription>Manage venue details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <MapClient center={center} url={location.url} />

          <div>
            <h3 className="text-sm font-medium text-gray-500">Coordinates</h3>
            <p>{location.latitude}, {location.longitude}</p>
          </div>

          {/* <div className="flex justify-end">
            <Button onClick={() => console.log("edit")}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Button>
          </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
