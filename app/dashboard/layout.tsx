import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <DashboardSidebar />
        <div className="flex-1 p-4 md:p-8 min-h-screen overflow-x-hidden">
          {children}
          <Toaster />
        </div>
      </div>
    </ThemeProvider>
  )
}
