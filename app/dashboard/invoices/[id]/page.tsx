"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Printer, Share } from "lucide-react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

// Mock invoice data - in a real app, this would be fetched from the server
const invoicesData = [
  {
    id: "INV-2025-001",
    client: "Acme Corporation",
    date: "2025-01-15",
    dueDate: "2025-02-15",
    amount: 15000,
    status: "paid",
    description: "Sponsorship package - Gold",
    items: [{ description: "Gold Sponsorship Package", quantity: 1, unitPrice: 15000, total: 15000 }],
    clientDetails: {
      name: "Acme Corporation",
      address: "123 Business Ave, Suite 100",
      city: "Casablanca",
      country: "Morocco",
      taxId: "TAX123456789",
    },
    paymentDetails: {
      method: "Bank Transfer",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
  },
  {
    id: "INV-2025-002",
    client: "TechStart Inc.",
    date: "2025-01-20",
    dueDate: "2025-02-20",
    amount: 8500,
    status: "paid",
    description: "Exhibition booth - Standard",
    items: [
      { description: "Standard Exhibition Booth", quantity: 1, unitPrice: 7500, total: 7500 },
      { description: "Additional Chairs", quantity: 4, unitPrice: 250, total: 1000 },
    ],
    clientDetails: {
      name: "TechStart Inc.",
      address: "456 Tech Park",
      city: "Rabat",
      country: "Morocco",
      taxId: "TAX987654321",
    },
    paymentDetails: {
      method: "Credit Card",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
  },
  {
    id: "INV-2025-003",
    client: "Global Fisheries",
    date: "2025-01-25",
    dueDate: "2025-02-25",
    amount: 12000,
    status: "pending",
    description: "Sponsorship package - Silver",
    items: [
      { description: "Silver Sponsorship Package", quantity: 1, unitPrice: 10000, total: 10000 },
      { description: "Logo Placement - Premium", quantity: 1, unitPrice: 2000, total: 2000 },
    ],
    clientDetails: {
      name: "Global Fisheries",
      address: "789 Ocean Drive",
      city: "Agadir",
      country: "Morocco",
      taxId: "TAX456789123",
    },
    paymentDetails: {
      method: "Bank Transfer",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
  },
  {
    id: "INV-2025-004",
    client: "Aqua Solutions",
    date: "2025-02-01",
    dueDate: "2025-03-01",
    amount: 7500,
    status: "paid",
    description: "Exhibition booth - Standard",
    items: [{ description: "Standard Exhibition Booth", quantity: 1, unitPrice: 7500, total: 7500 }],
    clientDetails: {
      name: "Aqua Solutions",
      address: "101 Water Street",
      city: "Tangier",
      country: "Morocco",
      taxId: "TAX789123456",
    },
    paymentDetails: {
      method: "Bank Transfer",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
  },
  {
    id: "INV-2025-005",
    client: "Marine Research Institute",
    date: "2025-02-05",
    dueDate: "2025-03-05",
    amount: 5000,
    status: "pending",
    description: "Partnership contribution",
    items: [{ description: "Partnership Contribution", quantity: 1, unitPrice: 5000, total: 5000 }],
    clientDetails: {
      name: "Marine Research Institute",
      address: "202 Science Boulevard",
      city: "Casablanca",
      country: "Morocco",
      taxId: "TAX321654987",
    },
    paymentDetails: {
      method: "Bank Transfer",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
  },
]

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Find the invoice by ID
  const invoice = invoicesData.find((inv) => inv.id === invoiceId)

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${invoice?.id}`,
  })

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save(`Invoice-${invoice?.id}.pdf`)
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold mb-4">Invoice not found</h1>
        <Button onClick={() => router.back()}>Return to Invoices</Button>
      </div>
    )
  }

  // Ensure clientDetails and paymentDetails exist with default values
  const clientDetails = invoice.clientDetails || {}
  const paymentDetails = invoice.paymentDetails || {}

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Invoice {invoice.id}</h1>
          <span
            className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${
              invoice.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {invoice.status === "paid" ? "Paid" : "Pending"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Print-ready invoice */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto" ref={invoiceRef}>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600">{invoice.id}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-primary">Event Manager</h2>
            <p className="text-gray-600">123 Event Street</p>
            <p className="text-gray-600">Casablanca, Morocco</p>
            <p className="text-gray-600">contact@eventmanager.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Bill To</h3>
            <p className="font-medium text-gray-900">{clientDetails.name || invoice.client}</p>
            <p className="text-gray-600">{clientDetails.address || "Address not provided"}</p>
            <p className="text-gray-600">
              {clientDetails.city || "City not provided"}, {clientDetails.country || "Country not provided"}
            </p>
            <p className="text-gray-600">Tax ID: {clientDetails.taxId || "Not provided"}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
              <p className="font-medium text-gray-900">{invoice.id}</p>
            </div>
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
              <p className="font-medium text-gray-900">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-left font-medium text-gray-500">Description</th>
                <th className="py-2 text-center font-medium text-gray-500">Quantity</th>
                <th className="py-2 text-right font-medium text-gray-500">Unit Price</th>
                <th className="py-2 text-right font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 text-gray-900">{item.description}</td>
                  <td className="py-4 text-center text-gray-900">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-900">{item.unitPrice.toLocaleString()} MAD</td>
                  <td className="py-4 text-right text-gray-900">{item.total.toLocaleString()} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">{invoice.amount.toLocaleString()} MAD</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-600">Tax (0%):</span>
              <span className="font-medium text-gray-900">0 MAD</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-gray-900">{invoice.amount.toLocaleString()} MAD</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Details</h3>
              <p className="text-gray-600">Method: {paymentDetails.method || "Not specified"}</p>
              <p className="text-gray-600">Account Name: {paymentDetails.accountName || "Not specified"}</p>
              <p className="text-gray-600">Account Number: {paymentDetails.accountNumber || "Not specified"}</p>
              <p className="text-gray-600">Bank: {paymentDetails.bankName || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <p className="text-gray-600">Thank you for your business. Please make payment by the due date.</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>This invoice was generated by Event Manager</p>
        </div>
      </div>
    </div>
  )
}
