"use client"

import { useState } from "react"
import { Calendar, MapPin, Info, Wifi, Users, Bell, Hotel, X, Menu } from "lucide-react"

export function FloatingActionButton({
  onSelect,
}: {
  onSelect: (type: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (type: string) => {
    onSelect(type)
    setIsOpen(false)
  }

  const buttons = [
    { icon: <Calendar className="h-5 w-5" />, type: "program", label: "Programme" },
    { icon: <Users className="h-5 w-5" />, type: "speakers", label: "Intervenants" },
    { icon: <MapPin className="h-5 w-5" />, type: "location", label: "Lieu" },
    { icon: <Info className="h-5 w-5" />, type: "about", label: "À propos" },
    { icon: <Wifi className="h-5 w-5" />, type: "network", label: "WiFi" },
    { icon: <Bell className="h-5 w-5" />, type: "notifications", label: "Notifications" },
    { icon: <Hotel className="h-5 w-5" />, type: "hotels", label: "Hôtels" },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 grid grid-cols-2 gap-2 w-[280px]">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleSelect(button.type)}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-lg text-[#004258] hover:bg-gray-100 transition-all duration-200"
            >
              {button.icon}
              <span className="text-sm font-medium">{button.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#004258] text-white shadow-lg flex items-center justify-center hover:bg-[#003245] transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  )
}
