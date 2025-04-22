"use client"

import Image from "next/image"
import { Download, ExternalLink } from "lucide-react"

export function QRCodeCard({
  qrCode,
  className,
  onClick,
}: {
  qrCode: {
    title: string
    description: string
    qrCodeUrl: string
    fileType: string
    fileSize: string
  }
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 relative w-32 h-32">
          <Image
            src={qrCode.qrCodeUrl || "/placeholder.svg"}
            alt={`QR Code pour ${qrCode.title}`}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">{qrCode.title}</h3>
        <p className="text-xs text-gray-600 mb-2">{qrCode.description}</p>
        <div className="flex items-center gap-2 text-xs text-[#004258]">
          <span className="px-2 py-1 bg-blue-50 rounded-full">{qrCode.fileType}</span>
          <span>{qrCode.fileSize}</span>
        </div>
      </div>
    </div>
  )
}

export function QRCodeDetailCard({
  qrCode,
}: {
  qrCode: {
    title: string
    description: string
    qrCodeUrl: string
    fileType: string
    fileSize: string
  }
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6 flex flex-col items-center">
        <div className="mb-4 relative w-48 h-48">
          <Image
            src={qrCode.qrCodeUrl || "/placeholder.svg"}
            alt={`QR Code pour ${qrCode.title}`}
            fill
            className="object-contain"
          />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{qrCode.title}</h3>
        <p className="text-gray-600 text-center mb-4">{qrCode.description}</p>

        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-50 rounded-full text-sm text-[#004258]">{qrCode.fileType}</span>
          <span className="text-sm text-gray-500">{qrCode.fileSize}</span>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors">
            <Download className="h-4 w-4" />
            Télécharger
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <ExternalLink className="h-4 w-4" />
            Ouvrir
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t">
        <p className="text-sm text-center text-gray-600">
          Scannez ce QR code avec votre appareil mobile pour accéder au document
        </p>
      </div>
    </div>
  )
}

export function FloorPlanLegend({ zones }: { zones: { name: string; color: string }[] }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Légende</h3>
      <div className="space-y-2">
        {zones.map((zone, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: zone.color }}></div>
            <span className="text-sm text-gray-700">{zone.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
