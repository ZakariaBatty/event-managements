"use client"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useRef } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface InvoicePreviewProps {
  invoice: any
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  // Add null checks to prevent errors
  if (!invoice) {
    return <div>No invoice data available</div>
  }

  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.innerHTML
      const originalContent = document.body.innerHTML

      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

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
    pdf.save(`Invoice-${invoice.id}.pdf`)
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString()
  }

  // Ensure these objects exist to prevent "cannot read properties of undefined" errors
  const clientDetails = invoice.clientDetails || {}
  const paymentDetails = invoice.paymentDetails || {}
  const items = invoice.items || []

  // Calculate totals
  const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.price || 0), 0)
  const taxRate = invoice.taxRate || 0
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  return (
    <div className="space-y-8">
      {/* Invoice Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
          <p className="text-gray-500">#{invoice.id || "N/A"}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold text-gray-900">From:</h3>
          <div className="mt-2 text-sm">
            <p className="font-medium">Event Management Company</p>
            <p>123 Business Street</p>
            <p>Casablanca, Morocco</p>
            <p>contact@eventmanagement.com</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Bill To:</h3>
          <div className="mt-2 text-sm">
            <p className="font-medium">{clientDetails.name || invoice.client || "Client Name"}</p>
            <p>{clientDetails.address || "Address not provided"}</p>
            <p>
              {clientDetails.city || ""}
              {clientDetails.city && clientDetails.country ? ", " : ""}
              {clientDetails.country || "Location not provided"}
            </p>
            <p>{clientDetails.email || "Email not provided"}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
        <div>
          <p className="text-xs text-gray-500">Invoice Date</p>
          <p className="font-medium">
            {invoice.date ? format(new Date(invoice.date), "MMM dd, yyyy") : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Due Date</p>
          <p className="font-medium">
            {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM dd, yyyy") : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Event</p>
          <p className="font-medium">{invoice.eventName || "Not specified"}</p>
        </div>
      </div>

      {/* Invoice Items */}
      <Card ref={invoiceRef}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.description || "Item description"}</p>
                        {item.details && <p className="text-sm text-gray-500">{item.details}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity || 0}</TableCell>
                    <TableCell className="text-right">
                      {item.price ? `${item.price.toLocaleString()} MAD` : "0 MAD"}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity && item.price ? `${(item.quantity * item.price).toLocaleString()} MAD` : "0 MAD"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No items added to this invoice
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Summary */}
      <div className="flex justify-end">
        <div className="w-80 space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Subtotal:</p>
            <p className="font-medium">{subtotal.toLocaleString()} MAD</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-gray-500">Tax ({taxRate}%):</p>
            <p className="font-medium">{taxAmount.toLocaleString()} MAD</p>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <p className="font-semibold">Total:</p>
            <p className="font-bold text-lg">{total.toLocaleString()} MAD</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-900">Payment Details</h3>
        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Payment Method:</p>
            <p>{paymentDetails.method || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-500">Status:</p>
            <p className={invoice.status === "paid" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
              {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : "Not specified"}
            </p>
          </div>
          {paymentDetails.accountName && (
            <div>
              <p className="text-gray-500">Account Name:</p>
              <p>{paymentDetails.accountName}</p>
            </div>
          )}
          {paymentDetails.accountNumber && (
            <div>
              <p className="text-gray-500">Account Number:</p>
              <p>{paymentDetails.accountNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div>
          <h3 className="font-semibold text-gray-900">Notes</h3>
          <p className="mt-1 text-sm text-gray-500">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
