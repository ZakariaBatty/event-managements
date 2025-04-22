"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  Settings,
  Users,
  Building,
  Mail,
  QrCode,
  Menu,
  X,
  PlusCircle,
} from "lucide-react"
import { SlideOver } from "@/components/dashboard/slide-over"
import { QuickEventForm } from "@/components/dashboard/quick-event-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [quickEventOpen, setQuickEventOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navigateTo = (path: string) => {
    router.push(path)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  const handleQuickEventSubmit = (eventData: any) => {
    // In a real app, you would call an API to save the event
    console.log("Quick event data to save:", eventData)
    setQuickEventOpen(false)

    // Navigate to events page after creating
    setTimeout(() => {
      router.push("/dashboard/events")
    }, 500)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar for both mobile and desktop */}
      <div
        className={cn(
          "pb-12 w-64 bg-white border-r border-gray-100 shadow-sm",
          "fixed inset-y-0 z-40 transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:relative",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-6 py-2 flex items-center justify-between">
            <Button
              variant="ghost"
              className="p-0 h-auto flex items-center font-display text-xl font-bold"
              onClick={() => navigateTo("/dashboard")}
            >
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EventPro
              </span>
            </Button>

            {/* Add Event Quick Button */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-light text-white"
              onClick={() => setQuickEventOpen(true)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Event
            </Button>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">Dashboard</h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname === "/dashboard" && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard")}
              >
                <Home className="mr-2 h-5 w-5 text-icon-blue" />
                <span>Overview</span>
              </Button>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname?.includes("/dashboard/events") && "bg-gray-100/80")}
                  onClick={() => navigateTo("/dashboard/events")}
                >
                  <Calendar className="mr-2 h-5 w-5 text-icon-purple" />
                  <span>Events</span>
                </Button>

                {pathname?.includes("/dashboard/events") && (
                  <div className="pl-9 space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => navigateTo("/dashboard/events/new")}
                    >
                      <PlusCircle className="mr-2 h-4 w-4 text-icon-purple" />
                      <span>Add Event</span>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname?.includes("/dashboard/clients") && "bg-gray-100/80")}
                  onClick={() => navigateTo("/dashboard/clients")}
                >
                  <Building className="mr-2 h-5 w-5 text-icon-orange" />
                  <span>Clients</span>
                </Button>
              </div>

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", pathname?.includes("/dashboard/users") && "bg-gray-100/80")}
                  onClick={() => navigateTo("/dashboard/users")}
                >
                  <Users className="mr-2 h-5 w-5 text-icon-green" />
                  <span>Users</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.includes("/dashboard/invites") && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard/invites")}
              >
                <Mail className="mr-2 h-5 w-5 text-icon-pink" />
                <span>Invites</span>
              </Button>

              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.includes("/dashboard/qrcodes") && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard/qrcodes")}
              >
                <QrCode className="mr-2 h-5 w-5 text-icon-indigo" />
                <span>QR Codes</span>
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">Administration</h2>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.includes("/dashboard/invoices") && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard/invoices")}
              >
                <CreditCard className="mr-2 h-5 w-5 text-icon-yellow" />
                <span>Invoices</span>
              </Button>

              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.includes("/dashboard/statistics") && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard/statistics")}
              >
                <BarChart3 className="mr-2 h-5 w-5 text-icon-teal" />
                <span>Statistics</span>
              </Button>

              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.includes("/dashboard/settings") && "bg-gray-100/80")}
                onClick={() => navigateTo("/dashboard/settings")}
              >
                <Settings className="mr-2 h-5 w-5 text-icon-cyan" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Event Creation SlideOver */}
      <SlideOver
        open={quickEventOpen}
        onClose={() => setQuickEventOpen(false)}
        title="Quick Add Event"
        side="right"
        width="400px"
      >
        <QuickEventForm onSubmit={handleQuickEventSubmit} onCancel={() => setQuickEventOpen(false)} />
      </SlideOver>
    </>
  )
}
