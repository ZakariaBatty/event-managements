"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

export function SpeakerCard({
  speaker,
  className,
  onClick,
}: {
  speaker: any
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full",
        className,
      )}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <Image
          src={speaker.pdfUrl || "/placeholder.svg?height=300&width=300"}
          alt={speaker.name}
          width={300}
          height={300}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-sm sm:text-lg text-gray-900 line-clamp-1">{speaker.name}</h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{speaker.organization}</p>
      </div>
    </div>
  )
}
