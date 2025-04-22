"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { InvoiceForm } from "@/components/dashboard/invoice-form"
import { InvoicePreview } from "@/components/dashboard/invoice-preview"
import { PlusCircle, Calendar, Building, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function InvoicesPage() {
  const router = useRouter()
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  // Mock data for invoices
  const invoices = [
    {
      id: "INV-2025-001",
      eventId: "evt-001",
      eventName: "Salon Halieutis 2025",
      client: "Acme Corporation",
      date: "2025-01-15",
      dueDate: "2025-02-15",
      amount: 15000,
      status: "paid",
    },
    {
      id: "INV-2025-002",
      eventId: "evt-001",
      eventName: "Salon Halieutis 2025",
      client: "TechStart Inc.",
      date: "2025-01-20",
      dueDate: "2025-02-20",
      amount: 8500,
      status: "paid",
    },

    {
      id: "INV-2025-003",
      eventId: "evt-002",
      eventName: "Tech Conference 2024",
      client: "Global Fisheries",
      date: "2025-01-25",
      dueDate: "2025-02-25",
      amount: 12000,
      status: "pending",
    },
    {
      id: "INV-2025-004",
      eventId: "evt-002",
      eventName: "Tech Conference 2024",
      client: "Aqua Solutions",
      date: "2025-02-01",
      dueDate: "2025-03-01",
      amount: 7500,
      status: "paid",
    },
    {
      id: "INV-2025-005",
      eventId: "evt-003",
      eventName: "Marketing Summit",
      client: "Marine Research Institute",
      date: "2025-02-05",
      dueDate: "2025-03-05",
      amount: 5000,
      status: "pending",
    },
  ]

  const columns = [
    {
      key: "id",
      label: "Invoice #",
      isTitle: true,
      render: (value: string) => <div className="font-medium text-primary">{value}</div>,
    },
    {
      key: "client",
      label: "Client",
      render: (value: string) => (
        <div className="flex items-center">
          <Building className="mr-1 h-4 w-4 text-accent" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "eventName",
      label: "Event",
      isTitle: true,
      titlePath: "/dashboard/events/:id/details",
      render: (value: string, item: any) => <div className="font-medium text-success">{value}</div>,
    },
    {
      key: "date",
      label: "Issue Date",
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4 text-warning" />
          <span>{format(new Date(value), "MMM d, yyyy")}</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (value: string) => (
        <div className="flex items-center">
          <Calendar className="mr-1 h-4 w-4 text-danger" />
          <span>{format(new Date(value), "MMM d, yyyy")}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (value: number) => (
        <div className="flex items-center">
          <CreditCard className="mr-1 h-4 w-4 text-primary" />
          <span className="font-medium">{value.toLocaleString()} MAD</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          className={
            value === "paid"
              ? "bg-success/10 text-success hover:bg-success/20"
              : value === "pending"
                ? "bg-warning/10 text-warning hover:bg-warning/20"
                : "bg-danger/10 text-danger hover:bg-danger/20"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ]

  const handleCreateInvoice = () => {
    setSelectedInvoice(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteInvoice = (invoice: any) => {
    // In a real app, you would call an API to delete the invoice
    console.log("Delete invoice:", invoice)
    alert(`Invoice "${invoice.id}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the invoice
    setSlideOverOpen(false)
    alert(`Invoice would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Invoices
          </h1>
          <p className="text-gray-500 mt-1">Manage your invoices and payments</p>
        </div>
        <Button onClick={handleCreateInvoice} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={invoices}
          columns={columns}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onView={handleViewInvoice}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="left"
        title={
          slideOverMode === "create" ? "Create Invoice" : slideOverMode === "edit" ? "Edit Invoice" : "Invoice Details"
        }
        width="70%"
      >
        {slideOverMode === "view" ? (
          <div className="p-4">
            <InvoicePreview invoice={selectedInvoice} />
          </div>
        ) : (
          <InvoiceForm
            invoice={selectedInvoice}
            mode={slideOverMode}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSlideOver}
          />
        )}
      </SlideOver>
    </div>
  )
}
