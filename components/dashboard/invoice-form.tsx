"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvoiceFormProps {
  invoice?: any
  mode: "create" | "edit" | "view"
  onSubmit: () => void
  onCancel: () => void
}

export function InvoiceForm({ invoice, mode, onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    client: "",
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    amount: 0,
    status: "pending",
    description: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    clientDetails: {
      name: "",
      address: "",
      city: "",
      country: "",
      taxId: "",
    },
    paymentDetails: {
      method: "Bank Transfer",
      accountName: "Event Manager Ltd",
      accountNumber: "IBAN123456789",
      bankName: "Morocco International Bank",
    },
    notes: "",
  })

  useEffect(() => {
    if (invoice && (mode === "edit" || mode === "view")) {
      setFormData({
        ...invoice,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        notes: invoice.notes || "",
      })
    } else if (mode === "create") {
      // Generate a new invoice ID
      const newId = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
      setFormData({
        ...formData,
        id: newId,
      })
    }
  }, [invoice, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleClientDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      clientDetails: {
        ...formData.clientDetails,
        [name]: value,
      },
    })
  }

  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      paymentDetails: {
        ...formData.paymentDetails,
        [name]: value,
      },
    })
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }

    // Recalculate total for this item
    if (field === "quantity" || field === "unitPrice") {
      newItems[index].total = Number(newItems[index].quantity) * Number(newItems[index].unitPrice)
    }

    // Recalculate total amount
    const totalAmount = newItems.reduce((sum, item) => sum + Number(item.total), 0)

    setFormData({
      ...formData,
      items: newItems,
      amount: totalAmount,
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return

    const newItems = formData.items.filter((_, i) => i !== index)
    const totalAmount = newItems.reduce((sum, item) => sum + Number(item.total), 0)

    setFormData({
      ...formData,
      items: newItems,
      amount: totalAmount,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the invoice
    console.log("Form data to save:", formData)
    onSubmit()
  }

  const isReadOnly = mode === "view"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="id">Invoice Number</Label>
            <Input
              id="id"
              name="id"
              value={formData.id}
              onChange={handleChange}
              placeholder="e.g., INV-2025-001"
              required
              readOnly={isReadOnly || mode === "edit"}
              className={cn(isReadOnly || mode === "edit" ? "bg-gray-50" : "")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Invoice description"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground",
                      isReadOnly && "bg-gray-50 pointer-events-none",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                {!isReadOnly && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground",
                      isReadOnly && "bg-gray-50 pointer-events-none",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                {!isReadOnly && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => setFormData({ ...formData, dueDate: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              disabled={isReadOnly}
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="name"
              value={formData.clientDetails.name}
              onChange={handleClientDetailsChange}
              placeholder="Client name"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.clientDetails.address}
              onChange={handleClientDetailsChange}
              placeholder="Client address"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.clientDetails.city}
                onChange={handleClientDetailsChange}
                placeholder="City"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.clientDetails.country}
                onChange={handleClientDetailsChange}
                placeholder="Country"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.clientDetails.taxId}
              onChange={handleClientDetailsChange}
              placeholder="Tax ID"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Invoice Items</h3>
          {!isReadOnly && (
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          )}
        </div>

        <div className="rounded-md border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-2 px-4 text-left font-medium text-gray-500">Description</th>
                <th className="py-2 px-4 text-center font-medium text-gray-500 w-24">Quantity</th>
                <th className="py-2 px-4 text-right font-medium text-gray-500 w-32">Unit Price</th>
                <th className="py-2 px-4 text-right font-medium text-gray-500 w-32">Total</th>
                {!isReadOnly && <th className="py-2 px-4 w-16"></th>}
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-4">
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      placeholder="Item description"
                      required
                      readOnly={isReadOnly}
                      className={isReadOnly ? "bg-gray-50 border-0" : "border-0"}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                      required
                      readOnly={isReadOnly}
                      className={cn("text-center", isReadOnly ? "bg-gray-50 border-0" : "border-0")}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                      required
                      readOnly={isReadOnly}
                      className={cn("text-right", isReadOnly ? "bg-gray-50 border-0" : "border-0")}
                    />
                  </td>
                  <td className="py-2 px-4 text-right font-medium">{Number(item.total).toLocaleString()} MAD</td>
                  {!isReadOnly && (
                    <td className="py-2 px-4 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50">
                <td colSpan={!isReadOnly ? 3 : 2} className="py-2 px-4 text-right font-medium">
                  Total:
                </td>
                <td className="py-2 px-4 text-right font-bold">{formData.amount.toLocaleString()} MAD</td>
                {!isReadOnly && <td></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              disabled={isReadOnly}
              value={formData.paymentDetails.method}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  paymentDetails: { ...formData.paymentDetails, method: value },
                })
              }
            >
              <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isReadOnly ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button type="submit" className="bg-primary hover:bg-primary-light">
            {mode === "create" ? "Create Invoice" : "Save Changes"}
          </Button>
        )}
      </div>
    </form>
  )
}
