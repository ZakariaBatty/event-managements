"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function ProgramCard({
  date,
  items,
  onSpeakerClick,
}: {
  date: string
  items: any[]
  onSpeakerClick: (speaker: any) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <div
        className="bg-[#004258] text-white p-4 text-center text-xl font-bold flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-6"></div>
        <div>{date}</div>
        <div>{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</div>
      </div>

      {isExpanded && (
        <div className="divide-y">
          {items
            .filter((item) => item.show)
            .map((item, itemIndex) => (
              <div key={itemIndex} className="p-4 bg-white hover:bg-gray-50">
                <div className="flex">
                  <div className="w-32 text-gray-500 font-medium pr-4 border-r">{item.time}</div>
                  <div className="flex-1 pl-4">
                    <div className="mb-2">
                      {item.type === "MASTER_CLASS" && (
                        <span className="text-blue-500 font-medium">MASTER CLASS: </span>
                      )}
                      {item.type === "SIDE_EVENT" && <span className="text-gray-700 font-medium">SIDE EVENT: </span>}
                      {item.type === "SHOWCASE" && <span className="text-green-600 font-medium">SHOWCASE: </span>}
                      {item.type === "ROUNDTABLE" && <span className="text-amber-600 font-medium">ROUNDTABLE: </span>}
                      {item.type === "NETWORKING" && (
                        <span className="text-purple-600 font-medium">CONFÉRENCE DU SALON HALIEUTIS </span>
                      )}
                      <span className="font-medium">{item.description}</span>
                    </div>
                    {item.speakers && item.speakers.length > 0 && (
                      <div className="mt-2 pl-2 border-l-2 border-gray-200">
                        {item.speakers.map((speaker: any, speakerIndex: number) => (
                          <div key={speakerIndex} className="mb-1">
                            <button
                              className="text-[#004258] hover:underline text-sm"
                              onClick={() =>
                                onSpeakerClick({
                                  ...speaker,
                                  eventTitle: item.description,
                                  eventType: item.type,
                                  eventTime: item.time,
                                  eventDate: date,
                                })
                              }
                            >
                              {speaker.name}
                            </button>
                            <span className="text-gray-500 text-sm"> ({speaker.organization})</span>
                            {speaker.title && (
                              <div className="text-sm text-gray-600 ml-4 mt-1 italic">{speaker.title}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
