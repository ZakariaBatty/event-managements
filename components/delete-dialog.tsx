// components/DeleteDialog.tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
  onConfirm: () => void
  Name: string
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  Name,
}) => {
  const [loading, setLoading] = useState(false)

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Delete Tool</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{Name}</strong> ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              onCancel?.()
            }}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
