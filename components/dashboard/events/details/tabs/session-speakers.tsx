"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserRound } from "lucide-react"

interface Speaker {
  name: string
  organization: string
  title?: string
  avatar?: string
}

interface SessionSpeakersProps {
  speakers: Speaker[]
  onSpeakerClick?: (speaker: any) => void
}

export function SessionSpeakers({ speakers, onSpeakerClick }: SessionSpeakersProps) {
  if (!speakers || speakers.length === 0) return null

  return (
    <div className="mt-3 space-y-3 pt-2 border-t border-gray-100">
      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
        <UserRound className="h-3.5 w-3.5" />
        {speakers.length > 1 ? "Speakers" : "Speaker"}
      </h4>

      <div className="space-y-3">
        {speakers.map((speaker, index) => (
          <div key={index} className="flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-gray-50">
            <Avatar className="h-9 w-9 border border-gray-100">
              <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
              <AvatarFallback className="bg-[#e7f5f9] text-[#004258] text-xs">
                {speaker.name}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <button
                className="text-[#004258] font-medium hover:underline text-sm"
                onClick={() => onSpeakerClick && onSpeakerClick(speaker)}
              >
                {speaker.name}
              </button>

              {speaker.organization && (
                <Badge variant="outline" className="ml-2 font-normal text-xs bg-white text-gray-600">
                  {speaker.organization}
                </Badge>
              )}

              {speaker.title && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{speaker.title}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
