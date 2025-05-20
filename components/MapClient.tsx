"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"

type Props = {
  center: LatLngExpression
  url: string
}

export default function MapClient({ center, url }: Props) {
  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
