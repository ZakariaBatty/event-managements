"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlideOver } from "@/components/dashboard/slide-over"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Mic, QrCode, Users, PlusCircle, Trash, Download } from "lucide-react"
import Image from "next/image"

// Mock data for a specific event
const eventData = {
  id: "1",
  name: "Salon Halieutis 2025",
  slug: "salon-halieutis-2025",
  description:
    "Le Salon Halieutis est un événement international dédié aux secteurs de la pêche, de l'aquaculture et de la valorisation des produits de la mer. Cette édition 2025 met l'accent sur l'innovation et le développement durable dans l'aquaculture, réunissant experts, chercheurs, industriels et décideurs du monde entier pour partager leurs connaissances et expériences.",
  date: "Feb 5-8, 2025",
  startDate: "2025-02-05",
  endDate: "2025-02-08",
  location: "Parc des Expositions, Agadir, Morocco",
  coordinates: "30.4278° N, 9.5981° W",
  mapUrl: "https://maps.google.com/?q=Parc+des+Expositions+Agadir",
  attendees: 1200,
  status: "upcoming",
  statistics: {
    speakers: 15,
    sessions: 24,
    partners: 8,
    registrations: 850,
  },
  sessions: [
    {
      id: "s1",
      title: "Master Class: Elevage de la crevette",
      date: "2025-02-05",
      time: "14:00 - 16:00",
      type: "MASTER_CLASS",
      description: "Techniques modernes d'élevage de la crevette",
      speakers: ["Lorenzo M. Juarez"],
      location: "Salle Conférence A",
    },
    {
      id: "s2",
      title: "Side Event: Aquaculture et Finance Bleue",
      date: "2025-02-05",
      time: "16:00 - 17:00",
      type: "SIDE_EVENT",
      description: "Catalyseurs du Développement des chaines de valeurs",
      speakers: ["Pierre FAILLER", "Mourabit Said", "Siham FELLAHI"],
      location: "Salle Conférence B",
    },
    {
      id: "s3",
      title: "Conférence du Salon Halieutis",
      date: "2025-02-06",
      time: "10:30 - 15:00",
      type: "NETWORKING",
      description: "L'Aquaculture de Demain : Synergie entre Recherche, Innovation et Développement Durable",
      speakers: [],
      location: "Auditorium Principal",
    },
  ],
  speakers: [
    {
      id: "sp1",
      name: "Lorenzo M. Juarez",
      organization: "Banque mondiale",
      bio: "Expert reconnu dans le domaine de l'aquaculture avec plus de 20 ans d'expérience.",
      sessions: ["s1"],
      avatar: "/placeholder.svg?height=200&width=200&text=LJ",
    },
    {
      id: "sp2",
      name: "Pierre FAILLER",
      organization: "Banque mondiale",
      bio: "Spécialiste en finance bleue et développement durable des ressources marines.",
      sessions: ["s2"],
      avatar: "/placeholder.svg?height=200&width=200&text=PF",
    },
    {
      id: "sp3",
      name: "Mourabit Said",
      organization: "Banque Islamique de Développement",
      bio: "Expert en développement économique et financement de projets aquacoles.",
      sessions: ["s2"],
      avatar: "/placeholder.svg?height=200&width=200&text=MS",
    },
    {
      id: "sp4",
      name: "Siham FELLAHI",
      organization: "Ministère de l'Économie et des Finances",
      bio: "Spécialiste des politiques économiques et du développement des clusters côtiers.",
      sessions: ["s2"],
      avatar: "/placeholder.svg?height=200&width=200&text=SF",
    },
  ],
  partners: [
    {
      id: "p1",
      name: "Ministère de l'Agriculture",
      logo: "/placeholder.svg?height=100&width=200&text=MinAgri",
      type: "Government",
      website: "https://www.agriculture.gov.ma/",
    },
    {
      id: "p2",
      name: "ANDA",
      logo: "/placeholder.svg?height=100&width=200&text=ANDA",
      type: "Organization",
      website: "https://www.anda.gov.ma/",
    },
    {
      id: "p3",
      name: "FAO",
      logo: "/placeholder.svg?height=100&width=200&text=FAO",
      type: "International",
      website: "https://www.fao.org/",
    },
    {
      id: "p4",
      name: "Banque Mondiale",
      logo: "/placeholder.svg?height=100&width=200&text=WorldBank",
      type: "International",
      website: "https://www.worldbank.org/",
    },
  ],
  qrCodes: [
    {
      id: "qr1",
      title: "Programme Complet",
      description: "Téléchargez le programme détaillé du salon",
      qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Programme",
      fileType: "PDF",
      fileSize: "2.4 MB",
    },
    {
      id: "qr2",
      title: "Plan du Salon",
      description: "Plan interactif des stands et salles de conférence",
      qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Plan",
      fileType: "PDF",
      fileSize: "1.8 MB",
    },
  ],
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverContent, setSlideOverContent] = useState<string>("")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  // In a real app, you would fetch the event data based on the ID
  const event = eventData

  const openSlideOver = (content: string, item?: any) => {
    setSlideOverContent(content)
    setSelectedItem(item)
    setSlideOverOpen(true)
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/events")} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <Badge
            className={
              event.status === "upcoming"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100 ml-2"
                : event.status === "active"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 ml-2"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 ml-2"
            }
          >
            {event.status === "upcoming" ? "Upcoming" : event.status === "active" ? "Active" : "Completed"}
          </Badge>
        </div>
        <Button onClick={() => openSlideOver("editEvent", event)} className="bg-primary hover:bg-primary-light">
          <Edit className="mr-2 h-4 w-4" />
          Edit Event
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Speakers</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.statistics.speakers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.statistics.sessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.statistics.partners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{event.statistics.registrations}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Basic information about the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Event Name</h3>
                <p className="mt-1">{event.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">URL Slug</h3>
                <p className="mt-1">{event.slug}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                <p className="mt-1">{new Date(event.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">End Date</h3>
                <p className="mt-1">{new Date(event.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1">{event.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{event.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="program">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="program" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Event Program</CardTitle>
                <CardDescription>Manage the schedule and sessions</CardDescription>
              </div>
              <Button size="sm" onClick={() => openSlideOver("addSession")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{session.description}</p>
                        {session.speakers.length > 0 && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Speakers:</span> {session.speakers.join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openSlideOver("editSession", session)}
                          className="text-gray-500 hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speakers" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Event Speakers</CardTitle>
                <CardDescription>Manage speakers and presenters</CardDescription>
              </div>
              <Button size="sm" onClick={() => openSlideOver("addSpeaker")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Speaker
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.speakers.map((speaker) => (
                  <div key={speaker.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={speaker.avatar || "/placeholder.svg"}
                          alt={speaker.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{speaker.name}</h4>
                        <p className="text-sm text-gray-500">{speaker.organization}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">{speaker.bio}</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openSlideOver("viewSpeaker", speaker)}
                        className="text-gray-500 hover:text-primary"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSlideOver("editSpeaker", speaker)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Location</CardTitle>
              <CardDescription>Manage venue details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Venue Name</h3>
                    <p className="mt-1">Parc des Expositions</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1">Agadir, Morocco</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Coordinates</h3>
                  <p className="mt-1">{event.coordinates}</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => openSlideOver("editLocation", event)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Event Partners</CardTitle>
                <CardDescription>Manage sponsors and partners</CardDescription>
              </div>
              <Button size="sm" onClick={() => openSlideOver("addPartner")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.partners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-32 relative mb-3">
                        <Image
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-medium text-center">{partner.name}</h4>
                      <p className="text-sm text-gray-500 text-center">{partner.type}</p>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSlideOver("editPartner", partner)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qrcodes" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>QR Codes</CardTitle>
                <CardDescription>Manage QR codes for the event</CardDescription>
              </div>
              <Button size="sm" onClick={() => openSlideOver("addQRCode")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add QR Code
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.qrCodes.map((qrCode) => (
                  <div key={qrCode.id} className="border rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      <div className="h-32 w-32 relative mb-3">
                        <Image
                          src={qrCode.qrCodeUrl || "/placeholder.svg"}
                          alt={qrCode.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-medium text-center">{qrCode.title}</h4>
                      <p className="text-sm text-gray-500 text-center">{qrCode.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {qrCode.fileType} - {qrCode.fileSize}
                      </p>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openSlideOver("editQRCode", qrCode)}
                        className="text-gray-500 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Right Sidebar for all forms */}
      <SlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        side="left"
        title={
          slideOverContent === "addSession"
            ? "Add Session"
            : slideOverContent === "editSession"
              ? "Edit Session"
              : slideOverContent === "addSpeaker"
                ? "Add Speaker"
                : slideOverContent === "editSpeaker"
                  ? "Edit Speaker"
                  : slideOverContent === "viewSpeaker"
                    ? "Speaker Details"
                    : slideOverContent === "editLocation"
                      ? "Edit Location"
                      : slideOverContent === "addPartner"
                        ? "Add Partner"
                        : slideOverContent === "editPartner"
                          ? "Edit Partner"
                          : slideOverContent === "addQRCode"
                            ? "Add QR Code"
                            : slideOverContent === "editQRCode"
                              ? "Edit QR Code"
                              : slideOverContent === "editEvent"
                                ? "Edit Event"
                                : ""
        }
      >
        {/* Content based on the selected action */}
        <div className="p-4">
          {slideOverContent === "viewSpeaker" && selectedItem && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                  <Image
                    src={selectedItem.avatar || "/placeholder.svg"}
                    alt={selectedItem.name}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                <p className="text-gray-600">{selectedItem.organization}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Biography</h3>
                  <p className="mt-1 text-gray-600">{selectedItem.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <ul className="mt-2 space-y-2">
                    {selectedItem.sessions.map((sessionId: string) => {
                      const session = event.sessions.find((s) => s.id === sessionId)
                      return session ? (
                        <li key={sessionId} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.date).toLocaleDateString()} • {session.time}
                          </p>
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setSlideOverOpen(false)}>
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-light"
                  onClick={() => {
                    setSlideOverContent("editSpeaker")
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Speaker
                </Button>
              </div>
            </div>
          )}

          {/* Other form contents would go here */}
          {(slideOverContent === "addSession" ||
            slideOverContent === "editSession" ||
            slideOverContent === "addSpeaker" ||
            slideOverContent === "editSpeaker" ||
            slideOverContent === "editLocation" ||
            slideOverContent === "addPartner" ||
            slideOverContent === "editPartner" ||
            slideOverContent === "addQRCode" ||
            slideOverContent === "editQRCode" ||
            slideOverContent === "editEvent") && (
            <div className="text-center py-8 text-gray-500">
              <p>Form content for {slideOverContent} would be implemented here</p>
              <div className="flex justify-end gap-2 pt-4 mt-8 border-t">
                <Button variant="outline" onClick={() => setSlideOverOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary-light">Save Changes</Button>
              </div>
            </div>
          )}
        </div>
      </SlideOver>
    </div>
  )
}
