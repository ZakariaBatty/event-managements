import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { inviteService } from "@/lib/services/invite-service"
import { InvitesClientComponent } from "@/components/dashboard/invites/invites-client-component"

export const metadata = {
  title: "Invites | Dashboard",
}

export default async function InvitesPage({ searchParams }: { searchParams: any }) {
  // Get the type filter from query params, default to all invites
  const type = await searchParams?.type || undefined

  // Fetch invites data with type filter if provided
  const { data: invites } = await inviteService.getInvites(1, 50, type ? { type } : {})

  // Fetch stats with type filter if provided
  const stats = await inviteService.getInviteStats(undefined, type)

  // Fetch countries for filters
  const countries = await inviteService.getCountries()

  return (
    <div className="space-y-4 md:space-y-6">
      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <InvitesClientComponent
          initialInvites={invites}
          initialStats={stats}
          countries={countries}
          initialType={type}
        />
      </Suspense>
    </div>
  )
}
