"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createInvite, updateInvite, deleteInvite } from "@/lib/actions/invite-actions"
import { SlideOver } from "@/components/dashboard/slide-over"
import { InviteForm } from "@/components/dashboard/invite-form"
import { Filter, Download, Mail } from "lucide-react"
import { InviteTypesTabs } from "./invite-types-tabs"
import { InviteStats } from "./invite-stats"
import { InviteFilters } from "./invite-filters"
import { InviteTable } from "./invite-table"

type invitePros = {
  initialInvites: any[]
  initialStats: {
    totalInvites: number
    confirmedInvites: number
    pendingInvites: number
    declinedInvites: number
  }
  countries: { id: string; name: string }[]
  initialType?: string
}

export function InvitesClientComponent({ initialInvites, initialStats, countries, initialType = "" }: invitePros) {
  const router = useRouter()
  const { toast } = useToast()
  // console.log("initialInvites", initialInvites)
  // console.log("initialStats", initialStats)
  // console.log("countries", countries)
  // console.log("initialType", initialType)
  const [searchTerm, setSearchTerm] = useState("")
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState(null)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    country: "",
    domain: "",
    event: "",
    status: "",
  })
  const [invites, setInvites] = useState(initialInvites)
  const [stats, setStats] = useState(initialStats)
  const [activeType, setActiveType] = useState(initialType || "invites")

  // Update URL when type changes
  useEffect(() => {
    if (activeType && activeType === "invites") {
      router.push(`/dashboard/invites?type=INVITE`)
      // router.push(`/dashboard/invites?type=${activeType === "invites" ? "INVITE" : "CLIENT"}`)
    } else {
      router.push(`/dashboard/invites?type=CLIENT`)
    }
  }, [activeType, router])

  // Apply filters and search
  const filteredInvites = invites.filter((invite) => {
    // Apply search
    const matchesSearch =
      searchTerm === "" ||
      invite.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invite.organization?.toLowerCase().includes(searchTerm.toLowerCase())

    // Apply filters
    const matchesCountry = filters.country === "" || invite.country?.id === filters.country
    const matchesDomain = filters.domain === "" || invite.domain === filters.domain
    const matchesEvent = filters.event === "" || invite.event?.id === filters.event
    const matchesStatus = filters.status === "" || invite.status === filters.status

    return matchesSearch && matchesCountry && matchesDomain && matchesEvent && matchesStatus
  })

  // Get unique values for filters
  // const domains = [...new Set(invites.map((invite) => invite.domain).filter(Boolean))]
  // const events = [...new Set(invites.map((invite) => invite.event?.title).filter(Boolean))].map((title) => {
  //   const invite = invites.find((i) => i.events?.title === title)
  //   return { id: invite.events?.id, title }
  // })


  const countries_ = [...new Set(invites.map((invite) => invite.country).filter(Boolean))]
  const domains = [...new Set(invites.map((invite) => invite.domain).filter(Boolean))]
  const events = [...new Set(invites.map((invite) => invite.events).filter(Boolean))]
  const statuses = ["confirmed", "pending", "declined"]

  const types = ["invites", "clients"]

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

  const handleDeleteInvite = async (invite: any) => {
    if (confirm(`Are you sure you want to delete the invite for ${invite.name}?`)) {
      const result = await deleteInvite(invite.id)
      if (result.success) {
        setInvites(invites.filter((i) => i.id !== invite.id))
        // Update stats
        // Map invite.status to the correct stats key
        const statusKey = (invite.status + "Invites") as keyof typeof stats
        setStats({
          ...stats,
          totalInvites: stats.totalInvites - 1,
          [statusKey]: stats[statusKey] - 1,
        })

        toast({
          title: "Invite deleted",
          description: `The invite for ${invite.name} has been deleted.`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete invite",
          variant: "destructive",
        })
      }
    }
  }

  const resetFilters = () => {
    setFilters({
      country: "",
      domain: "",
      event: "",
      status: "",
    })
  }

  const handleFormSubmit = async (data: any) => {
    let result

    if (slideOverMode === "create") {
      result = await createInvite(new FormData(data.target))
    } else if (selectedInvite) {
      // result = await updateInvite(selectedInvite.id, new FormData(data.target))
    } else {
      toast({
        title: "Error",
        description: "No invite selected for update.",
        variant: "destructive",
      })
      return
    }

    // if (result.success) {
    //   setSlideOverOpen(false)

    //   toast({
    //     title: slideOverMode === "create" ? "Invite created" : "Invite updated",
    //     description:
    //       slideOverMode === "create"
    //         ? "The invite has been created successfully."
    //         : `The invite for ${selectedInvite.name} has been updated.`,
    //   })

    //   // Refresh the page to get updated data
    //   router.refresh()
    // } else {
    //   toast({
    //     title: "Error",
    //     description: result.error || `Failed to ${slideOverMode} invite`,
    //     variant: "destructive",
    //   })
    // }
  }

  const handleTypeChange = (type: string) => {
    setActiveType(type)
  }

  return (
    <div className="space-y-4 md:space-y-6 p-6">
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

      <InviteTypesTabs activeType={activeType} types={types} onTypeChange={handleTypeChange} />

      <InviteStats stats={stats} />

      {showFilters && (
        <InviteFilters
          filters={filters}
          stats={stats}
          setFilters={setFilters}
          countries={countries_}
          domains={domains}
          events={events}
          statuses={statuses}
          onReset={resetFilters}
        />
      )}

      <InviteTable
        invites={filteredInvites}
        activeType={activeType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onView={handleViewInvite}
        onEdit={handleEditInvite}
        onDelete={handleDeleteInvite}
      />

      {/* <SlideOver
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
          onSubmit={handleFormSubmit}
          onCancel={() => setSlideOverOpen(false)}
          countries={countries}
          events={events}
        />
      </SlideOver> */}
    </div>
  )
}
