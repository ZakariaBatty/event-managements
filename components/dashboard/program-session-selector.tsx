"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ProgramSessionSelectorProps {
  sessions: any[]
  onSelect: (session: any) => void
  onCancel: () => void
}

export function ProgramSessionSelector({ sessions, onSelect, onCancel }: ProgramSessionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 border-gray-300"
        />
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-3">
        {filteredSessions.map((session, index) => (
          <div
            key={index}
            className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(session)}
          >
            <h4 className="font-medium">
              {session.title} {session.description}
            </h4>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{session.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{session.time}</span>
              </div>
            </div>
            {session.speakers && session.speakers.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Speakers:</span>{" "}
                {Array.isArray(session.speakers)
                  ? session.speakers.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
                  : ""}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
