"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
  side?: "right" | "left"
}

export function SlideOver({ open, onClose, title, children, width = "55%", side = "right" }: SlideOverProps) {
  const [mounted, setMounted] = useState(false)

  // Handle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Handle mounting/unmounting with animation
  useEffect(() => {
    if (open) {
      setMounted(true)
    } else {
      const timer = setTimeout(() => {
        setMounted(false)
      }, 300) // Match transition duration
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Slide panel */}
      <div
        className="absolute inset-y-0 flex flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out"
        style={{
          width: width,
          right: side === "right" ? 0 : "auto",
          left: side === "left" ? 0 : "auto",
          transform: open ? "translateX(0)" : `translateX(${side === "right" ? "100%" : "-100%"})`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-primary/80">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
