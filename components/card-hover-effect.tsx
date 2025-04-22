"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export const HoverEffect = ({
  items,
  className,
  onCardClick,
}: {
  items: {
    title: string
    description: string
    icon?: React.ReactNode
    link?: string
    show?: boolean
    type?: string
  }[]
  className?: string
  onCardClick?: (item: any) => void
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => {
        if (item.show === false) return null

        return (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onCardClick && onCardClick(item)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-100 block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left sm:gap-4">
                {item.icon}
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription className="hidden sm:block">{item.description}</CardDescription>
                </div>
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white border border-transparent group-hover:border-gray-300 relative z-20 cursor-pointer",
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export const CardTitle = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return <h4 className={cn("text-zinc-700 font-bold tracking-wide mt-4", className)}>{children}</h4>
}

export const CardDescription = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return <p className={cn("mt-2 text-zinc-600 tracking-wide leading-relaxed text-sm", className)}>{children}</p>
}
