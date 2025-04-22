"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export function Dialog({
  isOpen,
  onClose,
  children,
  className,
  position = "center",
  size = "lg",
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  position?: "center" | "right"
  size?: "sm" | "md" | "lg" | "xl" | "full"
}) {
  const [isClosing, setIsClosing] = useState(false)

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

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full h-full",
  }

  const positionClasses = {
    center: "inset-0 m-auto",
    right: "left-0 top-0 h-full",
  }

  const positionAnimations = {
    center: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    right: {
      initial: { opacity: 0, x: "-100%" },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: "-100%" },
    },
  }

  if (!isOpen && !isClosing) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            {...positionAnimations[position]}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-lg shadow-xl z-50 overflow-hidden",
              sizeClasses[size],
              positionClasses[position],
              className,
            )}
          >
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <div className="text-lg font-semibold">{/* Dialog title can be passed as a prop if needed */}</div>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[80vh]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
