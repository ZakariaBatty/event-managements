"use client"

import dynamic from "next/dynamic"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import type { LatLngExpression } from "leaflet"

// 👇 dynamic import without SSR
const MapClient = dynamic(() => import("../MapClient"), {
  ssr: false,
})

type Location = {
  latitude: number
  longitude: number
  url: string
}

export default function LocationCard({ location }: { location: Location }) {
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

          <div className="flex justify-end">
            <Button onClick={() => console.log("edit")}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
