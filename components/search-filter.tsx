"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"

export function SearchFilter({
  data,
  onFilter,
  placeholder = "Rechercher...",
  filterOptions = [],
}: {
  data: any[]
  onFilter: (filtered: any[]) => void
  placeholder?: string
  filterOptions?: { label: string; value: string }[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const prevFilteredRef = useRef<string>(JSON.stringify(data)) // Initialize with initial data

  // Apply filters and search
  useEffect(() => {
    let filtered = [...data]

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        // For program data, search in nested items
        if (item.items) {
          return item.items.some((subItem: any) => {
            return (
              (subItem.description && subItem.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (subItem.title && subItem.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (subItem.speakers &&
                subItem.speakers.some(
                  (speaker: any) =>
                    speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    speaker.organization.toLowerCase().includes(searchTerm.toLowerCase()),
                ))
            )
          })
        }

        // For regular items (like speakers)
        return Object.values(item).some((val) => {
          if (typeof val === "string") {
            return val.toLowerCase().includes(searchTerm.toLowerCase())
          }
          return false
        })
      })
    }

    // Apply filter for event type
    if (activeFilter) {
      // Check if we're dealing with program data (has items property)
      if (filtered.length > 0 && filtered[0].items) {
        // For program data, filter nested items
        filtered = filtered
          .map((day) => ({
            ...day,
            items: day.items.filter((item: any) => item.type === activeFilter),
          }))
          .filter((day) => day.items.length > 0)
      } else {
        // For speakers data
        filtered = filtered.filter((item) => {
          // Check both direct type and eventType properties
          return item.eventType === activeFilter
        })
      }
    }

    // Use JSON.stringify to compare the filtered results with previous results
    // Only call onFilter if the filtered results have actually changed
    const filteredString = JSON.stringify(filtered)

    if (prevFilteredRef.current !== filteredString) {
      prevFilteredRef.current = filteredString
      onFilter(filtered)
    }
  }, [searchTerm, activeFilter, data, onFilter])

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004258] focus:border-transparent"
        />
      </div>

      {filterOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeFilter === null ? "bg-[#004258] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tous
          </button>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeFilter === option.value
                  ? "bg-[#004258] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
