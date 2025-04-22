"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { ClientForm } from "@/components/dashboard/client-form"
import { PlusCircle, Mail, Phone, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ClientsPage() {
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedClient, setSelectedClient] = useState<any>(null)

  // Mock data for clients
  const clients = [
    {
      id: "client-001",
      name: "Moroccan Fisheries Association",
      contact: "Mohammed Alami",
      email: "m.alami@fisheries-morocco.org",
      phone: "+212 522 123 456",
      type: "partner",
      status: "active",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "client-002",
      name: "Aquaculture Solutions",
      contact: "Fatima Zahra",
      email: "fatima@aquasolutions.ma",
      phone: "+212 522 789 012",
      type: "exhibitor",
      status: "active",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "client-003",
      name: "Marine Tech Industries",
      contact: "Karim Benjelloun",
      email: "karim@marinetech.com",
      phone: "+212 522 345 678",
      type: "sponsor",
      status: "active",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "client-004",
      name: "Coastal Research Center",
      contact: "Nadia Tazi",
      email: "nadia@coastal-research.org",
      phone: "+212 522 901 234",
      type: "partner",
      status: "inactive",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "client-005",
      name: "Ocean Harvest Group",
      contact: "Youssef Mansouri",
      email: "youssef@oceanharvest.ma",
      phone: "+212 522 567 890",
      type: "exhibitor",
      status: "active",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const columns = [
    {
      key: "name",
      label: "Company",
      isTitle: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <Building className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <div className="font-medium text-primary">{value}</div>
            <div className="text-sm text-gray-500">{item.contact}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (value: string, item: any) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Mail className="mr-1 h-4 w-4 text-primary" />
            <span>{value}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-1 h-4 w-4 text-success" />
            <span>{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <Badge
          className={
            value === "sponsor"
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : value === "exhibitor"
                ? "bg-success/10 text-success hover:bg-success/20"
                : "bg-accent/10 text-accent hover:bg-accent/20"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          className={
            value === "active"
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }
        >
          {value === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  const handleCreateClient = () => {
    setSelectedClient(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditClient = (client: any) => {
    setSelectedClient(client)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewClient = (client: any) => {
    setSelectedClient(client)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteClient = (client: any) => {
    // In a real app, you would call an API to delete the client
    console.log("Delete client:", client)
    alert(`Client "${client.name}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the client
    setSlideOverOpen(false)
    alert(`Client would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-gray-500 mt-1">Manage your clients and partners</p>
        </div>
        <Button onClick={handleCreateClient} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={clients}
          columns={columns}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          onView={handleViewClient}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="left"
        title={
          slideOverMode === "create" ? "Add New Client" : slideOverMode === "edit" ? "Edit Client" : "Client Details"
        }
      >
        <ClientForm
          client={selectedClient}
          mode={slideOverMode}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseSlideOver}
        />
      </SlideOver>
    </div>
  )
}
