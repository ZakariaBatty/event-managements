"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, PlusCircle, Search, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { EmptyState } from "@/components/ui/empty-state"

interface SpeakersTabProps {
  speakers: any[]
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
}

export function SpeakersTab({ speakers, onOpenSlideOver, onDeleteItem }: SpeakersTabProps) {

  const [searchTerm, setSearchTerm] = useState("")

  const filteredSpeakers = speakers.filter(
    (speaker: any) =>
      speaker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      speaker.organization?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!speakers || speakers.length === 0) {
    return (
      <Card>
        <CardHeader className="flex !flex-row justify-between items-center">
          <div>
            <CardTitle>Event Speakers</CardTitle>
            <CardDescription>Manage speakers and presenters</CardDescription>
          </div>
          <Button size="sm" onClick={() => onOpenSlideOver("addSpeaker")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Speaker
          </Button>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No speakers found"
            description="There are no speakers for this event yet. Add your first speaker to get started."
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex !flex-row justify-between items-center">
        <div>
          <CardTitle>Event Speakers</CardTitle>
          <CardDescription>Manage speakers and presenters</CardDescription>
        </div>
        <Button size="sm" onClick={() => onOpenSlideOver("addSpeaker")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Speaker
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search speakers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 border-gray-300"
            />
          </div>
        </div>

        {filteredSpeakers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No speakers match your search criteria</p>
          </div>
        ) : (
          <div className="rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Speaker</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpeakers.map((speaker: any) => (
                  <TableRow key={speaker.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={speaker.avatar || "/placeholder.svg"}
                            alt={speaker.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="font-medium">{speaker.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{speaker.organization || "Not specified"}</TableCell>
                    <TableCell>
                      {speaker?._count.sideEventItem
                        ? `${speaker._count.sideEventItem} session${speaker._count.sideEventItems > 1 ? "s" : ""}`
                        : "0 sessions"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenSlideOver("viewSpeaker", speaker)}
                          className="text-gray-500 hover:text-primary"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenSlideOver("editSpeaker", speaker)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => onDeleteItem("speaker", speaker.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
