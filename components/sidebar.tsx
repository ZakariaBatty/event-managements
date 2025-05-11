/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import { useEffect, useState } from "react"

export function Sidebar({
  isOpen,
  onClose,
  children,
  title,
  className,
  width = "50%",
  showBackButton = false,
  onBack,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
  width?: string
  showBackButton?: boolean
  onBack?: () => void
}) {
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.body.style.overflow = "auto"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  if (!isOpen && !isClosing) return null

  // Use 85% width on mobile, otherwise use the provided width
  const sidebarWidth = isMobile ? "85%" : width

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("bg-white h-full shadow-xl z-50 overflow-hidden", className)}
            style={{ width: sidebarWidth, maxWidth: "100%" }}
          >
            <div className="flex justify-between items-center p-4 border-b bg-[#004258] text-white">
              <div className="text-lg font-semibold flex items-center">
                {showBackButton && (
                  <button onClick={onBack} className="mr-2 p-1 rounded-full hover:bg-[#003245] transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                {title}
              </div>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-[#003245] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-0 overflow-y-auto h-[calc(100vh-64px)]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
