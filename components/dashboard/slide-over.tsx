"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
  side?: "right" | "left"
}

// Update the SlideOver component to respect the side parameter
export function SlideOver({ open, onClose, title, children, width = "50%", side = "right" }: SlideOverProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  if (!open && !isClosing) return null

  // Use full width on mobile, otherwise use the provided width
  const slideOverWidth = isMobile ? "100%" : width

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 transition-opacity h-screen duration-300"
        style={{ opacity: isClosing ? 0 : 1 }}
        onClick={handleClose}
      />

      <div className={`fixed inset-y-0 ${side === "right" ? "[right:0!important]" : "left-0"} flex max-w-full`}>
        <div
          className="w-screen transform transition-transform duration-300 ease-in-out"
          style={{
            maxWidth: slideOverWidth,
            transform: isClosing ? (side === "right" ? "translateX(100%)" : "translateX(-100%)") : "translateX(0)",
          }}
        >
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-primary text-white flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold truncate">{title}</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-white hover:bg-primary-light">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>

  )
}
