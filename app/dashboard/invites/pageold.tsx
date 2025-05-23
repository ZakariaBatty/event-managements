"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Edit, Eye, Search, Trash, Filter, Download } from "lucide-react"
import { SlideOver } from "@/components/dashboard/slide-over"
import { InviteForm } from "@/components/dashboard/invites/invite-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for invites (keeping the same data)
const invitesData = [
  {
    id: "1",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    domain: "Government",
    phone: "+212 612 345 678",
    country: "Morocco",
    event: "Salon Halieutis 2025",
    status: "confirmed",
    createdAt: "2024-08-15T14:30:00",
    notes: "VIP guest, requires special accommodation",
    organization: "Ministry of Fisheries",
    position: "Director",
    dietary: "No restrictions",
    arrivalDate: "2025-02-04",
    departureDate: "2025-02-09",
  },
  {
    id: "2",
    name: "Fatima Zahra",
    email: "fatima@example.com",
    domain: "Academic",
    phone: "+212 623 456 789",
    country: "Morocco",
    event: "Salon Halieutis 2025",
    status: "pending",
    createdAt: "2024-08-16T09:15:00",
    notes: "Presenting research paper",
    organization: "University of Rabat",
    position: "Professor",
    dietary: "Vegetarian",
    arrivalDate: "2025-02-05",
    departureDate: "2025-02-07",
  },
  {
    id: "3",
    name: "Carlos Rodriguez",
    email: "carlos@example.com",
    domain: "Industry",
    phone: "+34 612 345 678",
    country: "Spain",
    event: "Salon Halieutis 2025",
    status: "confirmed",
    createdAt: "2024-08-17T11:45:00",
    notes: "Representing Spanish fishing industry",
    organization: "Spanish Fisheries Association",
    position: "CEO",
    dietary: "No shellfish",
    arrivalDate: "2025-02-04",
    departureDate: "2025-02-08",
  },
  {
    id: "4",
    name: "Amina Benali",
    email: "amina@example.com",
    domain: "NGO",
    phone: "+212 634 567 890",
    country: "Morocco",
    event: "Tech Conference 2024",
    status: "declined",
    createdAt: "2024-08-18T16:20:00",
    notes: "Unable to attend due to prior commitments",
    organization: "Ocean Conservation Morocco",
    position: "Program Director",
    dietary: "Vegan",
    arrivalDate: null,
    departureDate: null,
  },
  {
    id: "5",
    name: "John Smith",
    email: "john@example.com",
    domain: "Industry",
    phone: "+1 212 555 1234",
    country: "USA",
    event: "Salon Halieutis 2025",
    status: "pending",
    createdAt: "2024-08-19T13:10:00",
    notes: "Interested in investment opportunities",
    organization: "Global Seafood Inc.",
    position: "Investment Director",
    dietary: "No restrictions",
    arrivalDate: "2025-02-03",
    departureDate: "2025-02-10",
  },
  {
    id: "6",
    name: "Youssef Alami",
    email: "youssef@example.com",
    domain: "Government",
    phone: "+212 645 678 901",
    country: "Morocco",
    event: "Salon Halieutis 2025",
    status: "confirmed",
    createdAt: "2024-08-20T10:30:00",
    notes: "Local government representative",
    organization: "Agadir City Council",
    position: "Councilor",
    dietary: "No pork",
    arrivalDate: "2025-02-05",
    departureDate: "2025-02-08",
  },
  {
    id: "7",
    name: "Marie Dubois",
    email: "marie@example.com",
    domain: "Academic",
    phone: "+33 712 345 678",
    country: "France",
    event: "Salon Halieutis 2025",
    status: "confirmed",
    createdAt: "2024-08-21T14:45:00",
    notes: "Keynote speaker",
    organization: "University of Marseille",
    position: "Research Director",
    dietary: "Gluten-free",
    arrivalDate: "2025-02-04",
    departureDate: "2025-02-09",
  },
]

// Calculate statistics (keeping the same function)
const calculateStatistics = (data: any[]) => {
  const totalInvites = data.length
  const confirmedInvites = data.filter((invite) => invite.status === "confirmed").length
  const pendingInvites = data.filter((invite) => invite.status === "pending").length
  const declinedInvites = data.filter((invite) => invite.status === "declined").length

  // Count by country
  const countryStats = data.reduce((acc: Record<string, number>, invite) => {
    acc[invite.country] = (acc[invite.country] || 0) + 1
    return acc
  }, {})

  // Count by domain
  const domainStats = data.reduce((acc: Record<string, number>, invite) => {
    acc[invite.domain] = (acc[invite.domain] || 0) + 1
    return acc
  }, {})

  // Count by event
  const eventStats = data.reduce((acc: Record<string, number>, invite) => {
    acc[invite.event] = (acc[invite.event] || 0) + 1
    return acc
  }, {})

  return {
    totalInvites,
    confirmedInvites,
    pendingInvites,
    declinedInvites,
    countryStats,
    domainStats,
    eventStats,
  }
}

export default function InvitesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<any>(null)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    country: "",
    domain: "",
    event: "",
    status: "",
  })

  // Apply filters and search
  const filteredInvites = invitesData.filter((invite) => {
    // Apply search
    const matchesSearch =
      searchTerm === "" ||
      invite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.organization?.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply filters
    const matchesCountry = filters.country === "" || invite.country === filters.country
    const matchesDomain = filters.domain === "" || invite.domain === filters.domain
    const matchesEvent = filters.event === "" || invite.event === filters.event
    const matchesStatus = filters.status === "" || invite.status === filters.status

    return matchesSearch && matchesCountry && matchesDomain && matchesEvent && matchesStatus
  })

  // Calculate statistics for the filtered data
  const stats = calculateStatistics(filteredInvites)

  // Get unique values for filters
  const countries = [...new Set(invitesData.map((invite) => invite.country))]
  const domains = [...new Set(invitesData.map((invite) => invite.domain))]
  const events = [...new Set(invitesData.map((invite) => invite.event))]
  const statuses = [...new Set(invitesData.map((invite) => invite.status))]

  const handleCreateInvite = () => {
    setSelectedInvite(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditInvite = (invite: any) => {
    setSelectedInvite(invite)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewInvite = (invite: any) => {
    setSelectedInvite(invite)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteInvite = (invite: any) => {
    // In a real app, you would call an API to delete the invite
    console.log("Delete invite:", invite)
  }

  const resetFilters = () => {
    setFilters({
      country: "",
      domain: "",
      event: "",
      status: "",
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Invites</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="text-xs md:text-sm">
            <Filter className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="outline" className="text-xs md:text-sm">
            <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Export
          </Button>
          <Button onClick={handleCreateInvite} className="bg-primary hover:bg-primary-light text-xs md:text-sm">
            <Mail className="mr-2 h-3 w-3 md:h-4 md:w-4" />
            Send New Invite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium">Total Invites</CardTitle>
            <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-3 md:px-6 py-2">
            <div className="text-lg md:text-2xl font-bold">{stats.totalInvites}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">All invites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium">Confirmed</CardTitle>
            <Badge className="bg-green-100 text-green-800 text-[10px] md:text-xs">Confirmed</Badge>
          </CardHeader>
          <CardContent className="px-3 md:px-6 py-2">
            <div className="text-lg md:text-2xl font-bold">{stats.confirmedInvites}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {Math.round((stats.confirmedInvites / stats.totalInvites) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium">Pending</CardTitle>
            <Badge className="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs">Pending</Badge>
          </CardHeader>
          <CardContent className="px-3 md:px-6 py-2">
            <div className="text-lg md:text-2xl font-bold">{stats.pendingInvites}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {Math.round((stats.pendingInvites / stats.totalInvites) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
            <CardTitle className="text-xs md:text-sm font-medium">Declined</CardTitle>
            <Badge className="bg-red-100 text-red-800 text-[10px] md:text-xs">Declined</Badge>
          </CardHeader>
          <CardContent className="px-3 md:px-6 py-2">
            <div className="text-lg md:text-2xl font-bold">{stats.declinedInvites}</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              {Math.round((stats.declinedInvites / stats.totalInvites) * 100) || 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {showFilters && (
        <Card>
          <CardHeader className="px-4 md:px-6 py-4">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Filter invites by various criteria</CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country} ({stats.countryStats[country] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Domain</label>
                <Select value={filters.domain} onValueChange={(value) => setFilters({ ...filters, domain: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain} ({stats.domainStats[domain] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Event</label>
                <Select value={filters.event} onValueChange={(value) => setFilters({ ...filters, event: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event} ({stats.eventStats[event] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-4">
          <CardTitle>All Invites</CardTitle>
          <CardDescription>Manage your event invitations</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search invites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-gray-300"
              />
            </div>
          </div>

          <div className="rounded-md border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Email</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Domain</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Country</TableHead>
                  <TableHead className="whitespace-nowrap hidden lg:table-cell">Event</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No invites found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvites.map((invite) => (
                    <TableRow key={invite.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium whitespace-nowrap">{invite.name}</TableCell>
                      <TableCell className="whitespace-nowrap truncate max-w-[150px]">{invite.email}</TableCell>
                      <TableCell className="whitespace-nowrap hidden md:table-cell">{invite.domain}</TableCell>
                      <TableCell className="whitespace-nowrap hidden md:table-cell">{invite.country}</TableCell>
                      <TableCell className="whitespace-nowrap hidden lg:table-cell truncate max-w-[150px]">
                        {invite.event}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          className={
                            invite.status === "confirmed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : invite.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInvite(invite)}
                            className="text-gray-500 hover:text-primary h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInvite(invite)}
                            className="text-gray-500 hover:text-primary h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInvite(invite)}
                            className="text-gray-500 hover:text-red-500 h-8 w-8"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SlideOver
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        side="right"
        title={
          slideOverMode === "create" ? "Send New Invite" : slideOverMode === "edit" ? "Edit Invite" : "Invite Details"
        }
      >
        <InviteForm
          invite={selectedInvite}
          mode={slideOverMode}
          onSubmit={() => setSlideOverOpen(false)}
          onCancel={() => setSlideOverOpen(false)}
        />
      </SlideOver>
    </div>
  )
}
