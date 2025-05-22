"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InviteFiltersProps {
  filters: {
    country: string
    domain: string
    event: string
    status: string
  }
  stats: any
  setFilters: (filters: any) => void
  countries: any[]
  domains: string[]
  events: { id: string; title: string }[]
  statuses: string[]
  onReset: () => void
}

export function InviteFilters({
  filters,
  stats,
  setFilters,
  countries,
  domains,
  events,
  statuses,
  onReset,
}: InviteFiltersProps) {
  console.log("stats", stats);

  const countryStatsMap = Object.fromEntries(
    (stats.countryStats || []).map((item: any) => [item.countryId, item._count])
  );

  const domainStatsMap = Object.fromEntries(
    (stats.domainStats || []).map((item: any) => [item.domain, item._count])
  );

  const eventStatsMap = Object.fromEntries(
    (stats.eventStats || []).map((item: any) => [item.eventId, item._count])
  );

  return (
    <Card>
      <CardHeader className="px-4 md:px-6 py-4">
        <CardTitle className="text-lg">Filters</CardTitle>
        <CardDescription>Filter invites by various criteria</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country, index) => (
                  <SelectItem key={index} value={country.id}>
                    {country.name} ({countryStatsMap[country.id] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Domain</label>
            <Select value={filters.domain} onValueChange={(value) => setFilters({ ...filters, domain: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((domain, index) => (
                  <SelectItem key={index} value={domain}>
                    {domain} ({domainStatsMap[domain] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Event</label>
            <Select value={filters.event} onValueChange={(value) => setFilters({ ...filters, event: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event, index) => (
                  <SelectItem key={index} value={event.id}>
                    {event.title} ({eventStatsMap[event.id] || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

