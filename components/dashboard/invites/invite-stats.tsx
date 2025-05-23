import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"
import { use, useEffect, useState } from "react"

interface InviteStatsProps {
  stats: {
    totalInvites: number
    confirmedInvites: number
    pendingInvites: number
    declinedInvites: number
  }
}

export function InviteStats({ stats }: InviteStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Total Invites</CardTitle>
          <Mail className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 md:px-6 py-2">
          <div className="text-lg md:text-2xl font-bold">{stats.totalInvites}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">All invites</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Confirmed</CardTitle>
          <Badge className="bg-green-100 text-green-800 text-[10px] md:text-xs">Confirmed</Badge>
        </CardHeader>
        <CardContent className="px-3 md:px-6 py-2">
          <div className="text-lg md:text-2xl font-bold">{stats.confirmedInvites}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {Math.round((stats.confirmedInvites / stats.totalInvites) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Pending</CardTitle>
          <Badge className="bg-yellow-100 text-yellow-800 text-[10px] md:text-xs">Pending</Badge>
        </CardHeader>
        <CardContent className="px-3 md:px-6 py-2">
          <div className="text-lg md:text-2xl font-bold">{stats.pendingInvites}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {Math.round((stats.pendingInvites / stats.totalInvites) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Declined</CardTitle>
          <Badge className="bg-red-100 text-red-800 text-[10px] md:text-xs">Declined</Badge>
        </CardHeader>
        <CardContent className="px-3 md:px-6 py-2">
          <div className="text-lg md:text-2xl font-bold">{stats.declinedInvites}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {Math.round((stats.declinedInvites / stats.totalInvites) * 100) || 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
