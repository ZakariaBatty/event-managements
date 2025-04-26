"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Load collapsed state from localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed.toString())
  }, [isCollapsed])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navigateTo = (path: string) => {
    router.push(path)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  // Render a nav item with tooltip when collapsed
  const NavItem = ({
    icon,
    label,
    path,
    subItems = null,
  }: {
    icon: React.ReactNode
    label: string
    path: string
    subItems?: React.ReactNode
  }) => {
    const isActive = pathname === path || pathname?.includes(path)

    const button = (
      <Button
        variant="ghost"
        className={cn("w-full !justify-start", isActive && "bg-gray-100/80", isCollapsed && "px-2")}
        onClick={() => navigateTo(path)}
      >
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </Button>
    )

    return (
      <div className="space-y-1">
        {isCollapsed ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          button
        )}

        {!isCollapsed && subItems}
      </div>
    )
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
          "bg-white border-r border-gray-100 shadow-sm",
          "fixed inset-y-0 z-40 transition-all duration-300 ease-in-out h-full",
          "md:sticky md:top-0 md:h-screen",
          "md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div className="space-y-4 py-4 flex-1 overflow-y-auto">
            <div className={cn("px-6 py-2 flex items-center", isCollapsed && "px-2 justify-center")}>
              {!isCollapsed ? (
                <Button
                  variant="ghost"
                  className="p-0 h-auto flex items-center font-display text-xl font-bold"
                  onClick={() => navigateTo("/dashboard")}
                >
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    EventPro
                  </span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="p-0 h-auto flex items-center font-display text-xl font-bold"
                  onClick={() => navigateTo("/dashboard")}
                >
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EP</span>
                </Button>
              )}
            </div>

            <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
              {!isCollapsed && (
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">Dashboard</h2>
              )}
              <div className="space-y-1">
                <NavItem
                  icon={<Home className={cn("mr-2 h-5 w-5 text-icon-blue", isCollapsed && "mr-0")} />}
                  label="Overview"
                  path="/dashboard"
                />

                <NavItem
                  icon={<Calendar className={cn("mr-2 h-5 w-5 text-icon-purple", isCollapsed && "mr-0")} />}
                  label="Events"
                  path="/dashboard/events"
                  subItems={
                    pathname?.includes("/dashboard/events") && (
                      <div className="pl-9 space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full !justify-start text-sm"
                          onClick={() => navigateTo("/dashboard/events/new")}
                        >
                          <PlusCircle className="mr-2 h-4 w-4 text-icon-purple" />
                          <span>Add Event</span>
                        </Button>
                      </div>
                    )
                  }
                />

                <NavItem
                  icon={<Building className={cn("mr-2 h-5 w-5 text-icon-orange", isCollapsed && "mr-0")} />}
                  label="Clients"
                  path="/dashboard/clients"
                />

                <NavItem
                  icon={<Users className={cn("mr-2 h-5 w-5 text-icon-green", isCollapsed && "mr-0")} />}
                  label="Users"
                  path="/dashboard/users"
                />

                <NavItem
                  icon={<Mail className={cn("mr-2 h-5 w-5 text-icon-pink", isCollapsed && "mr-0")} />}
                  label="Invites"
                  path="/dashboard/invites"
                />

                <NavItem
                  icon={<QrCode className={cn("mr-2 h-5 w-5 text-icon-indigo", isCollapsed && "mr-0")} />}
                  label="QR Codes"
                  path="/dashboard/qrcodes"
                />
              </div>
            </div>

            <div className={cn("px-3 py-2", isCollapsed && "px-2")}>
              {!isCollapsed && (
                <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
                  Administration
                </h2>
              )}
              <div className="space-y-1">
                <NavItem
                  icon={<CreditCard className={cn("mr-2 h-5 w-5 text-icon-yellow", isCollapsed && "mr-0")} />}
                  label="Invoices"
                  path="/dashboard/invoices"
                />

                <NavItem
                  icon={<BarChart3 className={cn("mr-2 h-5 w-5 text-icon-teal", isCollapsed && "mr-0")} />}
                  label="Statistics"
                  path="/dashboard/statistics"
                />

                <NavItem
                  icon={<Settings className={cn("mr-2 h-5 w-5 text-icon-cyan", isCollapsed && "mr-0")} />}
                  label="Settings"
                  path="/dashboard/settings"
                />
              </div>
            </div>
          </div>

          {/* Collapse toggle button */}
          <div className="p-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center"
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <>
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <span>Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
