import Link from "next/link"
import {
  Calendar,
  Users,
  Building,
  CreditCard,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentEventsList } from "@/components/dashboard/recent-events-list"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="btn-modern">
            <Link href="/dashboard/events">
              <Calendar className="mr-2 h-4 w-4 text-icon-purple" />
              View All Events
            </Link>
          </Button>
          <Button
            asChild
            className="btn-modern bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link href="/dashboard/events/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-icon-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-success-DEFAULT" />
              <span className="text-success-DEFAULT">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-icon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-success-DEFAULT" />
              <span className="text-success-DEFAULT">+12.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building className="h-4 w-4 text-icon-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="mr-1 inline h-3 w-3 text-warning-DEFAULT" />
              <span className="text-warning-DEFAULT">Same</span> as last month
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-icon-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234</div>
            <p className="text-xs text-muted-foreground">
              <CheckCircle2 className="mr-1 inline h-3 w-3 text-success-DEFAULT" />
              <span className="text-success-DEFAULT">On track</span> for Q2 goal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <Card className="col-span-6 md:col-span-4 card-modern">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>You have 12 total events, with 3 upcoming in the next 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentEventsList />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full btn-modern">
              <Link href="/dashboard/events" className="flex items-center">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-6 md:col-span-2 card-modern">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start btn-modern">
              <Link href="/dashboard/events/new">
                <Calendar className="mr-2 h-4 w-4 text-icon-purple" />
                Create Event
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start btn-modern">
              <Link href="/dashboard/clients/new">
                <Building className="mr-2 h-4 w-4 text-icon-orange" />
                Add Client
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start btn-modern">
              <Link href="/dashboard/users/new">
                <Users className="mr-2 h-4 w-4 text-icon-green" />
                Add User
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start btn-modern">
              <Link href="/dashboard/invoices/new">
                <CreditCard className="mr-2 h-4 w-4 text-icon-yellow" />
                Create Invoice
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
