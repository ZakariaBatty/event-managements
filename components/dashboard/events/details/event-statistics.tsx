import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Mic, QrCode, Users } from "lucide-react"

interface EventStatisticsProps {
  statistics: {
    speakers: number
    sessions: number
    partners: number
    registrations: number
  }
}

export function EventStatistics({ statistics }: EventStatisticsProps) {
  if (!statistics) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Speakers</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Speakers</CardTitle>
          <Mic className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.speakers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.sessions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Partners</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.partners}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex !flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registrations</CardTitle>
          <QrCode className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.registrations}</div>
        </CardContent>
      </Card>
    </div>
  )
}
