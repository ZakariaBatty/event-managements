import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <div className="w-full md:w-[15%] md:min-w-[180px] md:max-w-[250px]">
          <DashboardSidebar />
        </div>
        <div className="w-full md:w-[85%] p-4 md:p-8 min-h-screen overflow-x-hidden">{children}</div>
      </div>
    </ThemeProvider>
  )
}
