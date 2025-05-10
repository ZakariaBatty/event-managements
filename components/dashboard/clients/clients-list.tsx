"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { ClientForm } from "@/components/dashboard/client-form"
import { PlusCircle, Mail, Phone, Building, PhoneCall } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Client {
  id: string
  name: string
  company: string | null
  email: string
  phone: string | null
  address: string | null
  city: string | null
  notes: string | null
  country: string | null
  createdAt: Date
  _count: {
    invoices: number
    events: number
  }
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  pageCount: number
}

interface ClientsListProps {
  clients: Client[]
  pagination: PaginationMeta
}

export default function ClientsList({ clients, pagination }: ClientsListProps) {

  const router = useRouter()
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const columns = [
    {
      key: "name",
      label: "Company Name",
      isTitle: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.logo ? (
              <Image src={item.logo || "/placeholder.svg"} alt={value} className="w-full h-full object-cover" width={40} height={40} />
            ) : (
              <Building className="h-5 w-5 text-gray-500" />
            )}
          </div>
          <div>
            <div className="font-medium text-primary">{value}</div>
            <div className="text-sm text-gray-500">{item.company}</div>
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
            <Mail className="mr-1 h-4 w-4 text-success" />
            <span>{value}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-1 h-4 w-4 text-primary" />
            <span>{item.phone || "N/A"}</span>
          </div>
        </div>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (value: string, item: any) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <PhoneCall className="mr-1 h-4 w-4 text-primary" />
            <span>{value}</span>
          </div>
          <div className="flex items-center">
            <Phone className="mr-1 h-4 w-4 text-success" />
            <span>{item.address || "N/A"}</span>
          </div>
        </div>
      ),
    },

    {
      key: "_count",
      label: "Activity",
      render: (value: any) => (
        <div className="text-sm w-[100px]">
          <div>{value.events} Events</div>
          <div>{value.invoices} Invoices</div>
        </div>
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

  const handleDeleteClient = async (client: any) => {
    if (confirm(`Are you sure you want to delete client "${client.name}"?`)) {
      // await deleteClient(client.id)
      router.refresh()
    }
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (slideOverMode === "create") {
        // await createClient(formData)
      } else if (slideOverMode === "edit" && selectedClient) {
        // await updateClient(selectedClient.id, formData)
      }

      setSlideOverOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }


  return (
    <div className="space-y-6">
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
        side="right"
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
