"use client"

import { CalendarIcon } from "lucide-react"
import { useState } from "react"

export function CalendarButton({
  eventTitle,
  eventDescription,
  startDate,
  endDate,
  location,
}: {
  eventTitle: string
  eventDescription: string
  startDate: string
  endDate: string
  location: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toISOString().replace(/-|:|\.\d+/g, "")
  }

  const generateGoogleCalendarUrl = () => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle,
    )}&dates=${start}/${end}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(location)}`
  }

  const generateICalFile = () => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)

    const icalContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${eventTitle}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `DESCRIPTION:${eventDescription}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n")

    const blob = new Blob([icalContent], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${eventTitle}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors"
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <CalendarIcon className="h-4 w-4" />
        Ajouter au calendrier
      </button>

      {showTooltip && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 overflow-hidden">
          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Google Calendar
          </a>
          <button
            onClick={generateICalFile}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Télécharger .ics
          </button>
        </div>
      )}
    </div>
  )
}
